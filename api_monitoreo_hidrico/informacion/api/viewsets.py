from rest_framework import viewsets

from informacion.models import Informacion

class ProyectosViewSet(viewsets.GenericViewSet):
    model: Informacion

    def create(self, request):
        pass