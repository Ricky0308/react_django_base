from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.http import HttpResponseForbidden

class CSRFProtectionMiddleware(MiddlewareMixin):
    """
    Middleware to enforce CSRF protection for REST API endpoints.

    This middleware verifies that state-changing HTTP methods (POST, PUT, PATCH, DELETE)
    include a valid CSRF token in both the request cookies and headers, ensuring they match.

    How it works:
    - It applies CSRF checks only to state-changing requests.
    - It extracts the CSRF token from:
      1. The request cookies (set by Django on prior requests).
      2. The request headers (sent by the client).
    - If either the cookie or header token is missing, or if they don't match, the request is rejected.

    Returns:
        - `None`: If CSRF validation is not required or passes successfully.
        - `HttpResponseForbidden`: If the CSRF token is missing or does not match.

    Notes:
    - This is a custom implementation of CSRF protection for APIs where traditional
      CSRF middleware may not be suitable.
    - Ensure that clients (e.g., frontend apps) correctly send the CSRF token in requests.

    Example Usage:
        headers = {
            "X-CSRFTOKEN": "your-csrf-token-value"
        }
        cookies = {
            "csrftoken": "your-csrf-token-value"
        }
        response = requests.post("https://api.example.com/endpoint/", headers=headers, cookies=cookies)
    """
    def process_view(self, request, view_func, view_args, view_kwargs):
        
        if settings.DEBUG:
            return None

        # Only enforce CSRF on state-changing methods
        if request.method in ('POST', 'PUT', 'PATCH', 'DELETE'):
            csrf_token_cookie = request.COOKIES.get(settings.CSRF_COOKIE_NAME)
            csrf_token_header = request.META.get(settings.CSRF_HEADER_NAME)

            if not csrf_token_cookie or not csrf_token_header:
                return HttpResponseForbidden("CSRF token missing.")

            if csrf_token_cookie != csrf_token_header:
                return HttpResponseForbidden("CSRF token mismatch.")

        return None
