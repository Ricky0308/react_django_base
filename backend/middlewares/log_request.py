class LogRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        full_url = f"{request.scheme}://{request.get_host()}{request.get_full_path()}"
        referrer = request.META.get('HTTP_REFERER', 'No referrer')
        print(f"Referrer URL: {referrer}")
        response = self.get_response(request)
        return response
