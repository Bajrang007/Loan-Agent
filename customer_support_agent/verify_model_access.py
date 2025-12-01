import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

def verify_model():
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
        print(f"Testing model: {llm.model}")
        response = llm.invoke("Hello, are you working?")
        print("Response received:")
        print(response.content)
        print("Verification SUCCESS")
    except Exception as e:
        print(f"Verification FAILED: {e}")

if __name__ == "__main__":
    verify_model()
