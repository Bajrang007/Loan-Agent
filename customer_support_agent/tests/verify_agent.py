import os
from dotenv import load_dotenv
load_dotenv()
from unittest.mock import MagicMock, patch
from langchain_core.messages import AIMessage, ToolMessage
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent.state import State
from agent.graph import graph

# Mock the LLM to avoid needing an API key
def mock_llm_invoke(messages):
    last_message = messages[-1]
    
    # Simple mock logic
    if "order" in last_message.content.lower():
        # Simulate tool call
        return AIMessage(
            content="",
            tool_calls=[{
                "name": "lookup_order",
                "args": {"order_id": "ORD-123"},
                "id": "call_123"
            }]
        )
    elif isinstance(last_message, ToolMessage):
        # Response after tool execution
        return AIMessage(content="Your order ORD-123 is currently shipped and expected to arrive tomorrow.")
    else:
        return AIMessage(content="I can help you with orders and policies.")

def run_verification():
    print("Starting verification...")
    
    # Patch the LLM in nodes.py (or effectively the node that uses it)
    # Since we imported 'graph' which already imported 'nodes', we need to patch where it's used.
    # However, 'nodes.py' has already instantiated 'llm_with_tools'.
    # We can patch 'agent.nodes.llm_with_tools.invoke'
    
    with patch('agent.nodes.llm_with_tools') as mock_llm:
        mock_llm.invoke.side_effect = mock_llm_invoke
        config = {"configurable": {"thread_id": "test_1"}}
        
        print("\n--- Test 1: General Query ---")
        inputs = {"messages": [("user", "Hi")]}
        for event in graph.stream(inputs, config=config):
            for key, value in event.items():
                print(f"Node '{key}': {value}")

        print("\n--- Test 2: Order Lookup (Tool Call) ---")
        inputs = {"messages": [("user", "Where is my order ORD-123?")]}
        for event in graph.stream(inputs, config=config):
            for key, value in event.items():
                print(f"Node '{key}': {value}")
                if key == "tools":
                    print("Tool Output:", value['messages'][0].content)

if __name__ == "__main__":
    run_verification()
