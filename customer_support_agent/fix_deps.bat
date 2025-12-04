@echo off
echo ============================================================
echo TIA Agent - Quick Dependency Fix
echo ============================================================
echo.
echo This will uninstall and reinstall langchain packages with
echo compatible versions to fix the pydantic_v1 import error.
echo.
pause

echo.
echo Step 1: Uninstalling current packages...
pip uninstall -y langchain langchain-core langchain-google-genai langchain-community

echo.
echo Step 2: Installing compatible versions...
pip install langchain-core==0.3.29
pip install langchain==0.3.29  
pip install langchain-google-genai==2.0.8
pip install langgraph

echo.
echo Step 3: Verifying installation...
python -c "from langchain_core.pydantic_v1 import Field; print('[OK] pydantic_v1 import successful')"
python -c "from langchain_google_genai import ChatGoogleGenerativeAI; print('[OK] ChatGoogleGenerativeAI import successful')"

echo.
echo ============================================================
echo Fix complete! You can now run: python start_agent.py
echo ============================================================
pause
