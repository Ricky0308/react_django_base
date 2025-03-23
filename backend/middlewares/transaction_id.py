# middleware.py
import uuid
import threading

# Thread-local storage to hold the current request
_thread_locals = threading.local()

def get_current_request():
    return getattr(_thread_locals, 'request', None)

class TransactionIDMiddleware:
    """
    Middleware that generates a unique transaction_id for every request,
    attaches it to the request object, and stores the request in thread-local storage.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Generate a unique transaction_id
        transaction_id = uuid.uuid4().hex
        # Attach it to the request object for later use in views if needed
        request.transaction_id = transaction_id
        # Store the request in thread-local storage so that the logging filter can access it
        _thread_locals.request = request

        # Continue processing the request
        response = self.get_response(request)
        # Add the transaction_id to the response headers
        response['X-Transaction-ID'] = request.transaction_id
        return response
