
import os
from dotenv import load_dotenv
load_dotenv()

from agent.graph import graph
from langchain_core.messages import HumanMessage

def run_test():
    print("Running test query: 'What is the return policy?'")
    config = {"configurable": {"thread_id": "test_1"}}
    
    try:
        events = graph.stream(
            {"messages": [HumanMessage(content="What is the return policy?")]},
            config=config
        )
        
        for event in events:
            for value in event.values():
                if "messages" in value:
                    print("Agent response:", value["messages"][-1].content)
                    
    except Exception as e:
        print(f"Caught exception: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_test()
