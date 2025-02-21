from django.contrib.auth import authenticate
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from usuarios.api.serializers import LoginUserSerializer, CustomTokenObtainPairSerializer, RequestPasswordResetSerializer, SetNewPasswordApiSerializer

from usuarios.models import CustomUser

from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator

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

#clase para enviar email y recuperar contraseña   
class RequestPasswordReset(GenericAPIView):
    serializer_class = RequestPasswordResetSerializer
    permission_classes = []
    authentication_classes = []
    
    def post(self, request):        
        result = self.serializer_class(data=request.data)      
        result.is_valid(raise_exception=True)#llamada de funcion para validar datos                       
        return Response({'success':True, 'message':'mensaje enviado'}, status=status.HTTP_200_OK)        

#clase para validar el token enviado en la recuperacion de contraseña
class PasswordTokenCheckApi(GenericAPIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request, encoded_pk, token):
        try:
            id = smart_str(urlsafe_base64_decode(encoded_pk))
            user = CustomUser.objects.get(id=id)
            if not(PasswordResetTokenGenerator().check_token(user, token)):
                return Response({'error': 'Token Invalido'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'success': True, 'message': 'Credencial Valida'}, status=status.HTTP_200_OK)
        except DjangoUnicodeDecodeError as p:
            if not(PasswordResetTokenGenerator().check_token(user, token)):
                return Response({'error': 'Token Invalido'}, status=status.HTTP_401_UNAUTHORIZED)

#clase para actualizar contraseña   
class SetNewPasswordApi(GenericAPIView):
    permission_classes = []
    authentication_classes = []
    serializer_class = SetNewPasswordApiSerializer

    def patch(self, request):           
        result = self.serializer_class(data=request.data)       
        result.is_valid(raise_exception=True)         
        return Response({'success': True, 'message': 'Contraseña Actualizada'}, status=status.HTTP_200_OK)
    

