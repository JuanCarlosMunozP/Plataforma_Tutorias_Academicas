from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import CSRFCheck
from rest_framework_simplejwt.authentication import JWTAuthentication

SAFE_METHODS = ("GET","HEAD","OPTIONS","TRACE")

def enforce_csrf(request) -> None:
    check = CSRFCheck(lambda request: None) 
    reason = check.process_view(request,None,(),{})
    if reason:
        raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self,request):
        header = self.get_header(request)
        if header is not None:
            raw_token = self.get_raw_token(header)
        else:
            raw_token = request.COOKIES.get(settings.AUTH_COOKIE_ACCESS_NAME)

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)

        if header is None and request.method not in SAFE_METHODS:
            enforce_csrf(request)

        return self.get_user(validated_token), validated_token