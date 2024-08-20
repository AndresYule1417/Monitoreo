from django.contrib.auth import authenticate
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from usuarios.api.serializers import LoginUserSerializer, CustomTokenObtainPairSerializer

from usuarios.models import CustomUser

#Clase para gestionar el login de un usuario, retorna el token, el nomnre del usuario, mesage y refresh token
class Login(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer    

    #funcion que capata la peticion post con email y password
    def post(self, request, *args, **kwargs):           
        email = request.data.get('email', '')
        password = request.data.get('password', '')              
        user = authenticate(email=email, password=password)        
        if(user):                       
            loginSerializar = self.serializer_class(data=request.data)           
            if(loginSerializar.is_valid()):
                userSerializer = LoginUserSerializer(user)
                return Response({
                    'token': loginSerializar.validated_data.get('access'),
                    'refresh_token': loginSerializar.validated_data.get('refresh'),
                    'user': userSerializer.data,
                    'message': 'Inicio de Sesion Exitoso'
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Contraseña o nombre de usuario incorrectos'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Contraseña o nombre de usuario incorrectos'}, status=status.HTTP_400_BAD_REQUEST)

#clase para salir de la secion
class Logout(GenericAPIView):
    def post(self, request, *args, **kwargs):
        user = CustomUser.objects.filter(id=request.data.get('user', 0))
        if user.exists():
            RefreshToken.for_user(user.first())
            return Response({'message': 'Sesión cerrada correctamente.'}, status=status.HTTP_200_OK)
        return Response({'error': 'No existe este usuario.'}, status=status.HTTP_400_BAD_REQUEST)