"""
MiniLab Django Settings - Development Configuration
Geliştirme ortamı için ayarlar.
"""
from .base import *

# Debug modunu aç
DEBUG = True

# Tüm host'lara izin ver (sadece geliştirmede!)
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '*']

# Browser reload için middleware ekle
MIDDLEWARE += [
    'django_browser_reload.middleware.BrowserReloadMiddleware',
]

# Internal IPs (Django Debug Toolbar ve browser reload için)
INTERNAL_IPS = [
    '127.0.0.1',
]

# Database - Development için SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Email Backend - Konsola yazdır (geliştirmede)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Cache - Geliştirmede lokal bellek
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Static files - WhiteNoise ile serve et (Django 4.2+ STORAGES kullanımı)
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

# Logging - Development
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# CSRF Ayarları (development)
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]
