from pathlib import Path
from datetime import timedelta
import os

#Archivo en donde se encuentra la configuracion del proyecto

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-f22+g*mybkqzfe4wiu1+=f=n1efnk&f-(v=t0h(u3shywoy^#_'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

#Aplicaciones propias del framework
BASE_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

#Aplicaciones creadas por el usuario
LOCAL_APPS = [       
    'usuarios',  
    'proyectos',  
    'informacion',
    'caudal',
    'rendimiento',
    'escorrentia',
    'oferta_multianual',
    'oferta_total',
    'indice'
]

#aplicaciones instaladas por el usuario
THIRD_APPS = [    
    'rest_framework',
    'rest_framework.authtoken', 
    'rest_framework_simplejwt',  
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    'simple_history'#adicion de codigo
]

INSTALLED_APPS = BASE_APPS + LOCAL_APPS + THIRD_APPS

#Configuracion para la autentificacion de las sesiones 
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',)
}

#El middleware es un marco de enlaces al procesamiento de solicitudes/respuestas de Django
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'simple_history.middleware.HistoryRequestMiddleware',#adicion de codigo
]

#Configuracion para llamar las rutas
ROOT_URLCONF = 'api_monitoreo_hidrico.urls'

#Configuracion para llamar a archivos HTML
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'api_monitoreo_hidrico.wsgi.application'

#Configuracion de la base de datos a utilizar
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'monitoreo_hidrico_v3',
        'USER': 'postgres',
        'PASSWORD': '12345',#'12345',
        'PASSWORD': '12345',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'es'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

#Configuacion del modelo usuarios a utilizar
AUTH_USER_MODEL = 'usuarios.CustomUser'

#Configuracion de cabezeras que permiten el acceso del lado del cliente
CORS_ALLOWED_ORIGINS = [        
    "http://localhost:4200",   
    "http://10.10.10.13:4200",     
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    "http://localhost:4200",  
    "http://10.10.10.13:4200",     
]

CORS_ORIGIN_WHITELIST = [
    "http://localhost:4200",  
    "http://10.10.10.13:4200",     
]

#Configuracion de parametros para el uso de las seciones
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=300), #tiempo activo de la secion
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

#Configuracion de rutas estaticas para CSS, IMG, TEMPLATES
STATIC_URL = 'static/'
MEDIA_URL =  'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

#Configuracion para enviar mensajes via email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = 'recursohidrico@ut.edu.co'
EMAIL_HOST_PASSWORD = 'laia rybm prme tvmr'