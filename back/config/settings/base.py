"""Configuracion base para el proyecto."""
from datetime import timedelta

import os
from pathlib import Path
from dotenv import load_dotenv
import environ

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DJANGO_DEBUG=(bool,False),
    DJANGO_ALLOWED_HOSTS=(list,["localhost","127.0.0.1"]),
    CORS_ALLOWED_ORIGINS=(list,[]),
    CRSF_TRUSTED_ORIGINS=(list,[]),
    CELERY_TASK_ALWAYS_EAGER=(bool,False)
)

# Carga env si existe
env_file = BASE_DIR / ".env"
if env_file.exists():
    environ.Env.read_env(str(env_file))

# Django Core
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY","change-me-in-production")
DEBUG = os.environ.get("DJANGO_DEBUG","True").lower() == "true"
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS",'localhost,127.0.0.1,0.0.0.0').split(",")

# Apps
DJANGO_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    "channels",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "django_filters",
    "corsheaders",
    "drf_spectacular",
    "drf_spectacular_sidecar",
    "axes",
]

LOCAL_APPS: list[str] = [
    'accounts',
    'audit',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

AUTH_USER_MODEL = "accounts.User"

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'csp.middleware.CSPMiddleware',
    'axes.middleware.AxesMiddleware',
]

AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesBackend",
    "django.contrib.auth.backend.ModelBackend",
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# Database (Postgres)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME":os.environ.get("DB_NAME"),
        "USER":os.environ.get("DB_USER"),
        "PASSWORD":os.environ.get("DB_PASSWORD"),
        "HOST":os.environ.get("DB_HOST"),
        "PORT":os.environ.get("DB_PORT")
    }
}

# Auth / Password
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]


# i18n / TZ
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static Media
STATIC_URL = 'static/'

# REST_FRAMEWORK
REST_FRAMEWORK = {
    "DEFAUL_AUTHENTICATION_CLASSES":{
        "common.authentication.CookieJWTAuthentication",
    },
    "DEFAULT_PERMISSION_CLASSES": {
        "rest_framework.permissions.isAuthenticated",
    },
    "DEFAULT_FILTER_BACKENDS":{
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    },
    "DEFAULT_THROTTLE_CLASSES":{
        "rest_framework.throttling.AnnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    },
    "DEFAULT_THROTLE_RATES":{
        "anon":os.getenv("THROTLE_RATE_ANON",default="20/min"),
        "user":os.getenv("THROTLE_RATE_USER",default="120/min"),
        "login":os.getenv("THROTLE_RATE_LOGIN",default="5/min"),
    }
}

# JsonWebToken
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=env.int("JWT_REFRESH_ACCESS_TOKEN_LIFETIME_MINUTES",default=60)
    ),
    "REFRESH_TOKEN_LIFETIME":timedelta(
        days=env.int("JWT_REFRESH_TOKEN_LIFETIME_DAYS",default=7)
    ),
    "AUTH_HEADER_TYPES":("Bearer",),
    "ROTATE_REFRESH_TOKENS":True,
    "BLACKLIST_AFTER_ROTATION":True,
}


# Cookies de Autenticación
AUTH_COOKIE_ACCESS_NAME = "access_token"
AUTH_COOKIE_REFRESH_NAME = "refresh_token"
AUTH_COOKIE_SAMESITE = os.getenv("AUTH_COOKIE_SAMESITE",default="Lax")
AUTH_COOKIE_SECURE = os.getenv("AUTH_COOKIE",default=False)

CSRF_COOKIE_SAMESITE = AUTH_COOKIE_SAMESITE
SESSION_COOKIE_SAMESITE = AUTH_COOKIE_SAMESITE

SPECTACULAR_SETTINGS = {
    "TITLE":"TutoAcademic API",
    "DESCRIPTION":"API para gestion de tutorías académicas",
    "VERSION":"0.1",
    "SERVE_INCLUDE_SCHEMA":False,
    "COMPONENT_SPLIT_REQUEST":False,
    "SWAGGER_UI_DIST":"SIDECAR",
    "SWAGGER_UI_FAVICON_HREF":"SIDECAR",
    "REDOC_DIST":"SIDECAR",
}

AXES_FAILURE_LIMIT = env.int("AXES_FAILURE_LIMIT",default=5)
AXES_COOLOFF_TIME = env.int("AXES_COOLOFF_TIME_HOURS",default=1)
AXES_LOCKOUT_PARAMETERS = [["username","ip_address"]]
AXES_RESET_ON_SUCCESS = True

CONTENT_SECURITY_POLICY = {
    "DIRECTIVES":{
        "default-src":["'self'"],
        "img-src":["'self'","data:"],
        "style-src":["'self'"],
        "script-src":["'self'"],
        "frame-ancestors":["'none'"],
        "object-src":["'none'"],
    }
}

CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS")
CRSF_TRUSTED_ORIGINS = os.getenv(
    "CRSF_TRUSTED_ORIGINS",
    default=env("CORS_ALLOWED_ORIGINS"),
)
CORS_ALLOW_CREDENTIALS=True

# Frontend (ReactVite)
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL",default="http://127.0.0.1:5173")

EMAIL_HOST = os.getenv("EMAIL_HOST",default="")
EMAIL_PORT = env.int("EMAIL_PORT",default=587)
EMAIL_USE_TLS = env("EMAIL_USE_TLS")
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER",default="")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD",default="")
DEFAUL_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    default="TutoAcademic API <noreply@tutoaca.local>",
)

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL",default="redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND",default="redis://localhost:6379/1")
CELERY_TASK_ALWAYS_EAGER = env("CELERY_TASK_ALWAYS_EAGER")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE

CHANNELS_REDIS_URL = os.getenv("CHANNELS_REDIS_URL",default="redis://localhost:6379/3")

# CHANNELS
CHANNEL_LAYERS = {
    "default":{
        "BACKEND":"channels_redis.core.RedisChannelLayer",
        "CONFIG":{
            "hosts":[
                {
                    "address":CHANNELS_REDIS_URL,
                    "socket_timeout":None,
                }
            ]
        }
    }
}

LOGGING = {
    "version":1,
    "disable_existing_loggers":False,
    "formatters":{
        "simple":{
            "format":"[{asctime}] {levelname} {name}: {message}",
            "style":"{",
        },
    },
    "handlers": {
        "console":{
            "class":"logging.StreamHandler",
            "formatter":"simple",
        },
    },
    "root":{
        "handlers":["console"],
        "level":os.getenv("DJANGO_LOG_LEVEL",default="INFO"),
    },
    "loggers":{
        "django_request":{
            "handlers":["console"],
            "level":"ERROR",
            "propagate":False,
        },
        "django_security":{
            "handlers":["console"],
            "level":"WARNING",
            "propagate":False
        }
    }
}


SENTRY_DSN = os.getenv("SENTRY_DSN",default="")
if SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    from sentry_sdk.integrations.logging import LoggingIntegration

    sentry_sdk.init(
        dsn=SENTRY_DSN,
        environment=os.getenv("SENTRY_ENVIRONMENT",default="production"),
        integrations=[
            DjangoIntegration(),
            LoggingIntegration(level=None,event_level="ERROR"),
        ],
        traces_sample_rate=env.float("SENTRY_TRACES_SAMPLE_RATE",default=0.1),
        send_default_pii=False
    )


