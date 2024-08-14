from rest_framework.routers import DefaultRouter
from proyectos.api.viewsets import ProyectosViewSet

router = DefaultRouter()

router.register('', ProyectosViewSet, basename='proyectos')

urlpatterns = router.urls