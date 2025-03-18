# filters.py
import logging
from middlewares.transaction_id import get_current_request

class TransactionIDFilter(logging.Filter):
    """
    Logging filter that injects the transaction_id from the current request into each log record.
    """
    def filter(self, record):
        request = get_current_request()
        record.transaction_id = request.transaction_id if request and hasattr(request, 'transaction_id') else 'N/A'
        return True
    

CATEGORIES = ["COMMON", "DEBUG", "SECURITY", "ANALYSIS"]

class CategoryFilter(logging.Filter):
    """
    Logging filter that injects the category from the current request into each log record.
    """

    def __init__(self, category):
        super().__init__()
        if category not in CATEGORIES:
            raise ValueError(f"Invalid category: {category}")
        self.category = category

    def filter(self, record):
        record.category = self.category
        return True