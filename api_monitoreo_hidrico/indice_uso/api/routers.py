from rest_framework.routers import DefaultRouter
from indice_uso.api.viewsets import IndiceUsoViewSet

router = DefaultRouter()

#archivo que gestiona las peticiones al invocar la ruta de proyectos
router.register('', IndiceUsoViewSet, basename='indice_uso')

urlpatterns = router.urls