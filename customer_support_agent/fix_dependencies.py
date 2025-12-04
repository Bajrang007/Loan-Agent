"""
Diagnostic and fix script for TIA agent dependencies
"""
import subprocess
import sys

def run_command(cmd):
    """Run a command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        return result.stdout + result.stderr
    except Exception as e:
        return f"Error: {e}"

def main():
    print("=" * 60)
    print("TIA Agent Dependency Diagnostic & Fix")
    print("=" * 60)
    
    # Check Python version
    print(f"\n1. Python Version: {sys.version}")
    
    # Check current langchain packages
    print("\n2. Current langchain packages:")
    output = run_command("pip list | findstr langchain")
    print(output)
    
    # Check if pydantic_v1 is available
    print("\n3. Testing pydantic_v1 import:")
    try:
        from langchain_core.pydantic_v1 import Field
        print("✓ pydantic_v1 import successful")
    except ImportError as e:
        print(f"✗ pydantic_v1 import failed: {e}")
        print("\n4. Attempting to fix by installing compatible versions...")
        
        # Uninstall problematic packages
        print("   - Uninstalling current packages...")
        run_command("pip uninstall -y langchain langchain-core langchain-google-genai")
        
        # Install compatible versions
        print("   - Installing compatible versions...")
        install_cmd = "pip install langchain-core==0.3.29 langchain==0.3.29 langchain-google-genai==2.0.8"
        output = run_command(install_cmd)
        print(output)
    
    # Test final import
    print("\n5. Final import test:")
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.pydantic_v1 import Field
        print("✓ All imports successful!")
        
        # Test model initialization
        print("\n6. Testing model initialization:")
        import os
        from dotenv import load_dotenv
        load_dotenv()
        
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            print(f"✓ API key found: {api_key[:10]}...")
            try:
                llm = ChatGoogleGenerativeAI(
                    model="gemini-2.0-flash-exp",
                    google_api_key=api_key
                )
                print("✓ Model initialized successfully")
            except Exception as e:
                print(f"✗ Model initialization failed: {e}")
        else:
            print("✗ No API key found in .env")
            
    except Exception as e:
        print(f"✗ Import still failing: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 60)
    print("Diagnostic complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
