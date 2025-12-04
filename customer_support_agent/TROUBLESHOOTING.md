# TIA Customer Support Agent - Troubleshooting Guide

## Common Issues and Solutions

### 1. ModuleNotFoundError: No module named 'langchain_core.pydantic_v1'

**Cause**: Version incompatibility between langchain packages. Langchain-core >= 1.0.0 removed pydantic_v1 module, but older versions of langchain-google-genai still depend on it.

**Solution**:
```bash
# Uninstall current versions
pip uninstall -y langchain langchain-core langchain-google-genai

# Install compatible versions
pip install langchain-core==0.3.29 langchain==0.3.29 langchain-google-genai==2.0.8
```

### 2. API Key Errors

**Symptoms**:
- "GOOGLE_API_KEY not found"
- "API key invalid"
- Authentication errors

**Solution**:
1. Ensure `.env` file exists in the `customer_support_agent` directory
2. Add your API key: `GOOGLE_API_KEY=your_actual_key_here`
3. Verify the key is valid at https://aistudio.google.com/apikey

### 3. Rate Limit / Quota Errors

**Symptoms**:
- "Quota exceeded"
- "Rate limit reached"

**Solution**:
- The agent now automatically retries with exponential backoff
- Wait a few moments and try again
- Check your API quota at Google AI Studio

### 4. Network/Connection Errors

**Symptoms**:
- "Connection timeout"
- "Network error"

**Solution**:
- Check your internet connection
- The agent will retry automatically (3 attempts)
- Verify firewall isn't blocking Google AI API

## Running the Agent

### Method 1: Using the startup script (Recommended)
```bash
python start_agent.py
```
This will check all dependencies and environment variables before starting.

### Method 2: Direct execution
```bash
python main.py
```

### Method 3: Run diagnostics first
```bash
python fix_dependencies.py
```
This will diagnose and attempt to fix dependency issues.

## Dependency Management

### Required Packages
- langgraph >= 0.2.0
- langchain >= 0.3.0, < 0.4.0
- langchain-core >= 0.3.0, < 0.4.0
- langchain-google-genai >= 2.0.0, < 3.0.0
- python-dotenv >= 1.0.0
- google-generativeai >= 0.8.0
- pydantic >= 2.0.0
- typing-extensions >= 4.0.0

### Installing All Dependencies
```bash
pip install -r requirements.txt
```

## Error Handling Features

The agent now includes:

1. **Automatic Retries**: Up to 3 attempts for transient errors
2. **Exponential Backoff**: Increasing delays between retries
3. **User-Friendly Messages**: Clear error messages instead of stack traces
4. **Graceful Degradation**: Continues running even if individual requests fail
5. **Specific Error Handling**:
   - Rate limit errors → Retry with delay
   - Network errors → Retry immediately
   - API key errors → Clear message to user
   - Quota errors → Friendly message with guidance

## Testing

### Test Import
```bash
python test_import.py
```

### Test Model Access
```bash
python verify_model_access.py
```

### Test Gemini API
```bash
python test_gemini.py
```

## Architecture

```
customer_support_agent/
├── main.py              # Entry point with error handling
├── start_agent.py       # Startup script with validation
├── fix_dependencies.py  # Diagnostic and fix script
├── .env                 # Environment variables (API key)
├── requirements.txt     # Python dependencies
├── agent/
│   ├── graph.py        # LangGraph workflow definition
│   ├── nodes.py        # Chatbot node with retry logic
│   └── state.py        # State definition
└── tools/
    └── search.py       # Tool functions (lookup_policy, lookup_order)
```

## Support

If issues persist:
1. Run `python fix_dependencies.py` for diagnostics
2. Check error.log for detailed error messages
3. Verify Python version (3.8+ required)
4. Ensure all packages are up to date
