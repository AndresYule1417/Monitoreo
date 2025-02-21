from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from rest_framework.exceptions import AuthenticationFailed

from usuarios.models import CustomUser

from usuarios.utils import Util

#clase para interpretar los datos python a json
class ListUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser #modelo utilizado
        fields = ('id', 'username', 'email', 'is_superuser', 'is_active') #Campos invocados

#clase para interpretar los datos python a json
class CustomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser #modelo utilizado
        fields = ('id', 'username', 'password', 'email', 'is_superuser', 'is_active') #Campos invocados

    #funcion sobreescrita para encriptar y guardar la contraseña
    def create(self, validated_data):        
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

#clase para interpretar los datos python a json
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser#modelo utilizado
        fields = ('username', 'password', 'email')#Campos invocados
    
    #funcion sobreescrita para actualizar un usuario
    def update(self, instance, validated_data):    
        instance.username = validated_data['username']
        instance.email = validated_data['email']
        instance.password = validated_data['password']
        instance.set_password(validated_data['password'])
        instance.save()
        return instance           

#clase para interpretar los datos python a json   
class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser#modelo utilizado
        fields = ('id', 'username', 'is_superuser')#Campos invocados

#clase para gestionar la autenticacion de las seciones 
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    pass

#clase para validar email, generar token, envia correo con la ruta para recuperar contraseña 
class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()    
    class Meta:        
        fields = ['email']
    
    def validate(self, attrs):        
        email = attrs.get('email', '')        
        if(CustomUser.objects.filter(email=email).exists()):             
            user = CustomUser.objects.get(email=email)            
            uidb64 = urlsafe_base64_encode(force_bytes(user.id))             
            token = PasswordResetTokenGenerator().make_token(user)            
            current_site = "10.10.10.3:4200"
            relative_link = reverse("recover-password", kwargs = {"encoded_pk": uidb64, "token": token})
            abs_url = "http://" + current_site + "/home" + relative_link            
            email_body = "hola " + user.username + " Ingrese al link para restablecer contraseña \n" + abs_url
            data = {'email_body':email_body, 'to_email':user.email, 'email_subject': 'Verifica tu email'}
            Util.sendMail(data)
            return super().validate(attrs)            
        else:            
            raise AuthenticationFailed('Email no existe', 403)

#clase para setear la nueva contraseña, valida si el token es valido
class SetNewPasswordApiSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)
    id = serializers.CharField(write_only=True)

    class Meta:
        fields = ['password', 'token', 'id']
    
    def validate(self, attrs):        
        try:            
            password = attrs.get('password')
            token = attrs.get('token')
            id = attrs.get('id')            
            
            id = force_str(urlsafe_base64_decode(id))
            user = CustomUser.objects.get(id=id)           

            if not(PasswordResetTokenGenerator().check_token(user, token)):
                raise AuthenticationFailed('Link invalido', 401)
            
            user_act = CustomUser(id=id)
            user_act.email = user.email
            user_act.username = user.username
            user_act.set_password(password)
            user_act.save()   

            return(CustomUser)
        except Exception as e:
            print("*****error*****", e)
            if not(PasswordResetTokenGenerator().check_token(user, token)):
                raise AuthenticationFailed('Link invalido', 401)       
        return super().validate(attrs)