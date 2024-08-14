from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from usuarios.views import Login, Logout

urlpatterns = [
    path('admin/', admin.site.urls),

    path('login/', Login.as_view(), name='Login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/', Logout.as_view(), name='logout'),

    path('usuarios/', include('usuarios.api.routers')),
    path('proyectos/', include('proyectos.api.routers')),
]
