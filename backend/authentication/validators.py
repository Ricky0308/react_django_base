from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from zxcvbn import zxcvbn

class ZXCVBNValidator:
    """
    Password validator using zxcvbn.
    Raises an error if the password strength score is less than 3.
    """
    def validate(self, password, user=None):
        # Evaluate password strength using zxcvbn
        result = zxcvbn(password)
        score = result.get('score', 0)  # score is an integer from 0 to 4
        
        # Allow passwords with a score of 3 or higher
        if score < 3:
            feedback = result.get('feedback', {})
            warning = feedback.get('warning', '')
            suggestions = " ".join(feedback.get('suggestions', []))
            message = _("This password is too weak. %s %s") % (warning, suggestions)
            raise ValidationError(message)

    def get_help_text(self):
        return _("Your password must be strong enough according to zxcvbn (score of at least 3).") 