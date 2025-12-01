from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import ToolMessage
from tools.search import lookup_policy, lookup_order
from agent.state import State
import os

# Initialize LLM
# Note: Ensure GOOGLE_API_KEY is set in .env
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

tools = [lookup_policy, lookup_order]
llm_with_tools = llm.bind_tools(tools)

def chatbot(state: State):
    try:
        return {"messages": [llm_with_tools.invoke(state["messages"])]}
    except Exception as e:
        # Fallback for any error (including OpenAI RateLimitError/InsufficientQuota)
        error_message = f"I apologize, but I'm encountering an issue connecting to the AI service: {str(e)}"
        return {"messages": [ToolMessage(content=error_message, tool_call_id="error_fallback")]}
