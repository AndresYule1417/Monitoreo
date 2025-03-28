from rest_framework import viewsets

from informacion.models import Informacion
from informacion.api.serializers import CreateInformacionSerializer

class InformacionViewSet(viewsets.GenericViewSet):
    model: Informacion
    serializer_class = CreateInformacionSerializer

    def create(self, request):
        pass

    #def destroy(self, request, pk=None):        
    #    result = self.serializer_class().Meta.model.objects.filter(id_proyecto=pk)        
    #    if(result):            
    #        result_delete = result.delete()     
