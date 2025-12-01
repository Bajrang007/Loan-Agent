from langchain_core.tools import tool

@tool
def lookup_policy(query: str) -> str:
    """Consult the company policies to answer user questions."""
    # Mock policy data
    policies = {
        "return": "You can return items within 30 days of purchase.",
        "shipping": "Standard shipping takes 3-5 business days.",
        "refund": "Refunds are processed within 5-7 business days after we receive the return."
    }
    
    query = query.lower()
    for key, value in policies.items():
        if key in query:
            return value
            
    return "I couldn't find a specific policy for that. Please contact support@example.com."

@tool
def lookup_order(order_id: str) -> str:
    """Look up the status of an order by its ID."""
    # Mock order database
    orders = {
        "ORD-123": "Shipped - Expected delivery tomorrow.",
        "ORD-456": "Processing - Will ship within 24 hours.",
        "ORD-789": "Delivered - Left at front door."
    }
    
    return orders.get(order_id, "Order not found. Please check the ID and try again.")
