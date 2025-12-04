from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import ToolMessage, AIMessage
from tools.search import lookup_policy, lookup_order
from agent.state import State
import os
import time
from typing import Dict, Any

# Initialize LLM with error handling
def initialize_llm():
    """Initialize the LLM with proper error handling"""
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            google_api_key=api_key,
            temperature=0.7,
            max_retries=3
        )
        return llm
    except Exception as e:
        print(f"Warning: Failed to initialize LLM: {e}")
        return None

llm = initialize_llm()
tools = [lookup_policy, lookup_order]

if llm:
    llm_with_tools = llm.bind_tools(tools)
else:
    llm_with_tools = None

def chatbot(state: State) -> Dict[str, Any]:
    """
    Main chatbot function with comprehensive error handling and retry logic
    """
    max_retries = 3
    retry_delay = 1  # seconds
    
    if not llm_with_tools:
        error_msg = ("I apologize, but the AI service is not properly configured. "
                    "Please check that GOOGLE_API_KEY is set in the .env file.")
        return {"messages": [AIMessage(content=error_msg)]}
    
    for attempt in range(max_retries):
        try:
            response = llm_with_tools.invoke(state["messages"])
            return {"messages": [response]}
            
        except Exception as e:
            error_type = type(e).__name__
            error_msg = str(e)
            
            # Handle specific error types
            if "quota" in error_msg.lower() or "rate" in error_msg.lower():
                if attempt < max_retries - 1:
                    time.sleep(retry_delay * (attempt + 1))
                    continue
                else:
                    friendly_msg = ("I apologize, but I've reached my usage limit. "
                                  "Please try again in a few moments.")
                    return {"messages": [AIMessage(content=friendly_msg)]}
                    
            elif "api" in error_msg.lower() or "key" in error_msg.lower():
                friendly_msg = ("I apologize, but there's an issue with the API configuration. "
                              "Please verify that your API key is valid and has the necessary permissions.")
                return {"messages": [AIMessage(content=friendly_msg)]}
                
            elif "network" in error_msg.lower() or "connection" in error_msg.lower():
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    continue
                else:
                    friendly_msg = ("I apologize, but I'm having trouble connecting to the service. "
                                  "Please check your internet connection and try again.")
                    return {"messages": [AIMessage(content=friendly_msg)]}
            
            # Generic error handling
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
                continue
            else:
                friendly_msg = (f"I apologize, but I encountered an unexpected error: {error_type}. "
                              f"Please try rephrasing your question or contact support if the issue persists.")
                return {"messages": [AIMessage(content=friendly_msg)]}
    
    # Fallback if all retries failed
    fallback_msg = ("I apologize, but I'm unable to process your request at the moment. "
                   "Please try again later.")
    return {"messages": [AIMessage(content=fallback_msg)]}

