from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny

from usuarios.models import CustomUser
from usuarios.api.serializers import ListUserSerializer, UpdateUserSerializer, CustomCreateSerializer

class UserViewSet(viewsets.GenericViewSet):
    model: CustomUser
    serializer_class = ListUserSerializer
    
    #Funcion que retorna una lista o array de todos los usuarios
    def list(self, request):
        result = ListUserSerializer().Meta.model.objects.filter(is_superuser=True)
        if(result):
            result_serializer = ListUserSerializer(result, many=True)
            return Response(result_serializer.data, status=status.HTTP_200_OK)
        return Response()

    #Funcion que actualiza un usuario, como parametro necesita el ID
    def update(self, request, pk=None):        
        result = UpdateUserSerializer().Meta.model.objects.filter(id=pk).first()          
        if(result):                    
            result_serializer = UpdateUserSerializer(result, data=request.data)                                        
            if result_serializer.is_valid():                                  
                return Response({'message': 'Usuario Actualizado'}, status=status.HTTP_200_OK)            
            return Response({'message': 'Error', 'error': result_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    #Funcion que elimina un usuario
    def destroy(self, request, pk=None): 
        result = self.serializer_class().Meta.model.objects.filter(id=pk).first()
        #if(result[0] != 0):
        if result:           
            result_delete = result.delete()       
            if(result_delete[0] != 0):
                return Response({'message': 'Usuario eliminado'}, status=status.HTTP_200_OK)
        return Response({'message': 'No Existe Usuario'}, status=status.HTTP_404_NOT_FOUND) 
    
    #Funcion que crea un usuario, no nesesita paerimos de autenticacion
    @action(detail=True, methods=['post'], permission_classes=[], authentication_classes=[])    
    def custom_create(self, request, pk=None):            
        serializer = CustomCreateSerializer(data=request.data)
        if(serializer.is_valid()):           
            serializer.save()
            return Response({'message': 'Usuario Reguistrado'}, status=status.HTTP_201_CREATED)        
        print(serializer.errors)
        return Response({'message': 'Error en Registro', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)