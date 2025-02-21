from rest_framework.routers import DefaultRouter
from proyectos.api.viewsets import ProyectosViewSet

router = DefaultRouter()

#archivo que gestiona las peticiones al invocar la ruta de proyectos
router.register('', ProyectosViewSet, basename='proyectos')

urlpatterns = router.urls