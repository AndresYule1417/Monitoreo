from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from usuarios.models import CustomUser

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