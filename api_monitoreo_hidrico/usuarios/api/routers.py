#archivo q contiene la ruta para el llamdo del cliente el cual gestiona las peticiones 
#GET, POST, PUT, DELETE
from rest_framework.routers import DefaultRouter
from usuarios.api.viewsets import UserViewSet

router = DefaultRouter()

router.register('', UserViewSet, basename='usuarios')

urlpatterns = router.urls