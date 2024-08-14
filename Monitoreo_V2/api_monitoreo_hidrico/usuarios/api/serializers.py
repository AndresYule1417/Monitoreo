from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from usuarios.models import CustomUser

class ListUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'is_superuser', 'is_active')

class CustomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'password', 'email', 'is_superuser', 'is_active')

    def create(self, validated_data):        
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'password', 'email', 'is_superuser', 'is_active')

    def create(self, validated_data):        
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'email')
    
    def update(self, instance, validated_data):    
        instance.username = validated_data['username']
        instance.email = validated_data['email']
        instance.password = validated_data['password']
        instance.set_password(validated_data['password'])
        instance.save()
        return instance           
    
class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'is_superuser')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    pass