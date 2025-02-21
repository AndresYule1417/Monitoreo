from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from simple_history.models import HistoricalRecords

#Clase para crear usuarios desde la consola
class UserManager(BaseUserManager):
    def _create_user(self, username, password, is_staff, is_superuser, **extra_field):
        user = self.model(
            username = username,                
            is_staff = is_staff,
            is_superuser = is_superuser,      
            **extra_field
        )

        user.set_password(password)
        user.save(using=self.db)
        return user
    
    def create_user(self, username, password=None, **extra_field):
        return self._create_user(username, password, False, False, **extra_field)
    
    def create_superuser(self, username, password=None, **extra_field):
        return self._create_user(username, password, True, True, **extra_field)

#clase para definir el modelo de usuario el cual se crea en la base de datos
class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=16, unique=True, null=False)
    email = models.CharField(max_length=64, unique=True, null=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)     
    historical = HistoricalRecords()#adicion de codigo
    objects = UserManager()

    class Meta:
        db_table = 'usuarios'   

    REQUIRED_FIELDS = ["username"]
    
    USERNAME_FIELD = 'email'

    def natural_key(self):
        return (self.username)
    
    def __str__(self):        
        return f'{self.username}'
