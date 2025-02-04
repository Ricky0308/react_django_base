from config import settings

def get_webpage_user_activation_url(uidb64, token):
    return settings.WEBPAGE_USER_ACTIVATION_URL + "/" + uidb64 + "/" + token  