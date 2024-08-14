from rest_framework.routers import DefaultRouter
from usuarios.api.viewsets import UserViewSet

router = DefaultRouter()

router.register('', UserViewSet, basename='usuarios')

urlpatterns = router.urls