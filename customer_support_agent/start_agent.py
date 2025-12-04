"""
Startup script for TIA Customer Support Agent
Checks dependencies and environment before launching
"""
import sys
import os

def check_dependencies():
    """Check if all required dependencies are installed"""
    print("Checking dependencies...")
    
    missing_deps = []
    
    # Check critical imports
    try:
        import langchain
        print("[OK] langchain installed")
    except ImportError:
        missing_deps.append("langchain")
        print("[FAIL] langchain missing")
    
    try:
        import langchain_core
        print("[OK] langchain-core installed")
    except ImportError:
        missing_deps.append("langchain-core")
        print("[FAIL] langchain-core missing")
    
    try:
        from langchain_core.pydantic_v1 import Field
        print("[OK] langchain-core.pydantic_v1 available")
    except ImportError:
        print("[FAIL] langchain-core.pydantic_v1 missing - version incompatibility detected")
        print("  This usually means langchain-core is too new (>= 1.0.0)")
        print("  Recommended: langchain-core >= 0.3.0, < 0.4.0")
        missing_deps.append("langchain-core (version issue)")
    
    try:
        import langchain_google_genai
        print("[OK] langchain-google-genai installed")
    except ImportError:
        missing_deps.append("langchain-google-genai")
        print("[FAIL] langchain-google-genai missing")
    
    try:
        import langgraph
        print("[OK] langgraph installed")
    except ImportError:
        missing_deps.append("langgraph")
        print("[FAIL] langgraph missing")
    
    try:
        from dotenv import load_dotenv
        print("[OK] python-dotenv installed")
    except ImportError:
        missing_deps.append("python-dotenv")
        print("[FAIL] python-dotenv missing")
    
    return missing_deps

def check_environment():
    """Check if environment variables are set"""
    print("\nChecking environment...")
    
    from dotenv import load_dotenv
    load_dotenv()
    
    api_key = os.getenv("GOOGLE_API_KEY")
    if api_key:
        print(f"[OK] GOOGLE_API_KEY found ({api_key[:10]}...)")
        return True
    else:
        print("[FAIL] GOOGLE_API_KEY not found in .env file")
        return False

def main():
    print("=" * 60)
    print("TIA Customer Support Agent - Startup Check")
    print("=" * 60)
    print()
    
    # Check dependencies
    missing = check_dependencies()
    
    if missing:
        print(f"\n[ERROR] Missing dependencies: {', '.join(missing)}")
        print("\nTo fix, run:")
        print("  pip install -r requirements.txt")
        print("\nIf you still have issues, try:")
        print("  pip uninstall -y langchain langchain-core langchain-google-genai")
        print("  pip install langchain-core==0.3.29 langchain==0.3.29 langchain-google-genai==2.0.8")
        return False
    
    # Check environment
    if not check_environment():
        print("\n[ERROR] Environment not configured properly")
        print("\nPlease ensure .env file exists with:")
        print("  GOOGLE_API_KEY=your_api_key_here")
        return False
    
    print("\n" + "=" * 60)
    print("[SUCCESS] All checks passed! Starting agent...")
    print("=" * 60)
    print()
    
    # Import and run main
    try:
        from main import main as run_agent
        run_agent()
    except Exception as e:
        print(f"\n[ERROR] Error starting agent: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
