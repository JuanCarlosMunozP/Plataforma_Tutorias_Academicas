"""
URLConf raiz del proyecto.

Las rutas se versionan bajo /api/v1/. 
"""
from urllib.parse import urlparse,urlunparse

from django.conf import settings

from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path,include,re_path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView
)
from rest_framework_simplejwt.views import (
    TokenBlacklistView,
    TokenRefreshView,
    TokenVerifyView
)
from common.views import (
    CookieTokenLogoutView,
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    HealthView,
    ThrottledTokenObtainPairView
)


_LOOPBACK = {"localhost","127.0.0.1","0.0.0.0"}

def redirect_to_frontend_home(request,leftover=None):
    parsed = urlparse(settings.FRONTEND_BASE_URL)
    request_host = request.get_host().split(":")[0]
    frontend_host = (parsed.hostname or "").lower()
    if request_host.lower() in _LOOPBACK and frontend_host in _LOOPBACK:
        netloc = f"{request_host}:{parsed.port}" if parsed.port else request_host
        return redirect(urlunparse((parsed.scheme or "http",netloc,"/","","","")))
    return redirect(settings.FRONTEND_BASE_URL.rstrip("/") + "/")

urlpatterns = [
    re_path(r"^admin(/.*)?$",redirect_to_frontend_home),
    path('django-admin/',admin.site.urls),
    path('api/schema/',SpectacularAPIView.as_view(),name="schema"),
    path('api/docs/',SpectacularRedocView.as_view(url_name="schema")),
    path('api/redoc/',SpectacularRedocView.as_view(url_name="schema")),
    path('api/v1/health/',HealthView.as_view(),name="health"),
    path('api/v1/auth/token',ThrottledTokenObtainPairView.as_view(),name="token-obtain"),
    path('api/v1/auth/token/refresh/',TokenRefreshView.as_view(),name="token-refresh"),
    path('api/v1/auth/token/verify/',TokenVerifyView.as_view(),name="token-verify"),
    path('api/v1/auth/token/blacklist/',TokenBlacklistView.as_view(),name="token-blacklist"),
    path('api/v1/auth/token/cookie',CookieTokenObtainPairView.as_view(),name="token-obtain-cookie"),
    path('api/v1/auth/token/cookie/refresh/',CookieTokenRefreshView.as_view(),name="token-refresh-cookie"),
    path('api/v1/auth/token/cookie/logout/',CookieTokenLogoutView.as_view()),
    path('api/v1/users/',include(("accounts.urls","accounts"),namespace="accounts"))
]

