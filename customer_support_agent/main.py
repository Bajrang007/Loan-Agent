import os
from dotenv import load_dotenv
load_dotenv()

from agent.graph import graph

def main():
    print("Customer Support Agent (CLI)")
    print("Type 'quit' or 'exit' to end the conversation.")
    
    try:
        config = {"configurable": {"thread_id": "1"}}
        
        while True:
            try:
                user_input = input("User: ")
                if user_input.lower() in ["quit", "exit"]:
                    break
                    
                for event in graph.stream({"messages": [("user", user_input)]}, config=config):
                    for value in event.values():
                        if "messages" in value and value["messages"]:
                            print("Agent:", value["messages"][-1].content)
            except KeyboardInterrupt:
                print("\nExiting...")
                break
            except Exception as e:
                print(f"\nAn error occurred during processing: {e}")
                print("Please try again.")
                
    except Exception as e:
        print(f"Critical Error: {e}")

if __name__ == "__main__":
    try:
        main()
    except ImportError as e:
        print(f"Dependency Error: {e}")
        print("Please ensure all requirements are installed: pip install -r requirements.txt")
    except Exception as e:
        print(f"Startup Error: {e}")
