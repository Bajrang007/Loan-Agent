import os
from dotenv import load_dotenv
load_dotenv()

from agent.graph import graph

def main():
    print("Customer Support Agent (CLI)")
    print("Type 'quit' or 'exit' to end the conversation.")
    
    config = {"configurable": {"thread_id": "1"}}
    
    while True:
        user_input = input("User: ")
        if user_input.lower() in ["quit", "exit"]:
            break
            
        for event in graph.stream({"messages": [("user", user_input)]}, config=config):
            for value in event.values():
                print("Agent:", value["messages"][-1].content)

if __name__ == "__main__":
    main()
