from django.contrib import admin

from usuarios.models import CustomUser

#class AuthorAdmin(admin.ModelAdmin):
    #fields = ['email', 'username', 'password', 'is_active', 'is_superuser']
#admin.site.register(CustomUser, AuthorAdmin)

admin.site.register(CustomUser)
