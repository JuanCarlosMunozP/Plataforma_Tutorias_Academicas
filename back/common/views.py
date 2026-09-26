from django.conf import settings
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .authentication import enforce_csrf

def _cookie_kwargs(max_age:int) -> dict:
    return {
        "max_age":max_age,
        "httpOnly":True,
        "secure":settings.AUTH_COOKIE_SECURE,
        "path":"/",
    }

def _set_auth_cookies(response:Response, *, access: str | None = None, refresh: str | None = None) -> None:
    if access is not None:
        lifetime = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
        response.set_cookie(settings.AUTH_COOKIE_ACCESS_NAME, access, **_cookie_kwargs(lifetime))
    if refresh is not None:
        lifetime = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())
        response.set_cookie(settings.AUTH_COOKIE_REFRESH_NAME,refresh,**_cookie_kwargs(lifetime))

def _delete_auth_cookies(response:Response) -> None:
    response.delete_cookie(settings.AUTH_COOKIE_ACCESS_NAME,path="/")
    response.delete_cookie(settings.AUTH_COOKIE_REFRESH_NAME,path="/")

class ThrottledTokenObtainPairView(TokenObtainPairView):
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = "login"

class CookieTokenObtainPairView(ThrottledTokenObtainPairView):
    def finalize_response(self,request,response,*args,**kwargs):
        response = super().finalize_response(request,response,*args,**kwargs)
        if response.status_code == 200 and isinstance(response.data,dict):
            access = response.data.pop("access",None)
            refresh = response.data.pop("refresh",None)
            _set_auth_cookies(response, access=access, refresh=refresh)
            get_token(request)

        return response

class CookieTokenRefreshView(APIView):
    permission_classes = ()
    authentication_classes = ()

    def post(self,request,*args,**kwargs):
        enforce_csrf(request)

        refresh = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH_NAME)
        if not refresh:
            return Response({"detail":"No hay refresh token."},status=401)

        serializer = TokenRefreshSerializer(data={"refresh":refresh})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError:
            response = Response({"detail":"Refresh token inválido o expirado."},status=401)
            _delete_auth_cookies(response)
            return response

        data = serializer.validated_data
        response = Response({})
        _set_auth_cookies(response,access=data.get("access"),refresh=data.get("refresh"))
        return response


class CookieTokenLogoutView(APIView):

    permission_classes = ()
    authentication_classes = ()

    def post(self,request,*args,**kwargs):
        enforce_csrf(request)

        refresh = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH_NAME)
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except TokenError:
                pass

        response = Response(status=204)
        _delete_auth_cookies(response)
        return response


class HealthView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self,request,*args,**kwargs):
        from django.db import connection
        from redis import Redis

        checks: dict[str,str] = {}

        try:
            connection.ensure_connection()
            checks["database"] = "ok"
        except Exception as exc:
            checks["database"] = str(exc)
        try:
            Redis.from_url(settings.CHANNELS_REDIS_URL, socket_connect_timeout=2).ping()
            checks["redis"] = "ok"
        except Exception as exc:
            checks["redis"] = str(exc)

        ok = checks.get("database") == "ok" and checks.get("redis") == "ok"
        return Response({"status":"ok" if ok else "degraded","checks":checks},status=200 if ok else 503)