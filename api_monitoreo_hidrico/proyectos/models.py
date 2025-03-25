from django.db import models

#Clase para definir el modelo de un proyecto el cual se crea en la base de datos
class Proyectos(models.Model):
    nombre = models.CharField(max_length=64, null=False, blank=False)
    fecha = models.DateTimeField(null=False, blank=False)
    archivo = models.FileField(upload_to='documentos/', max_length=255, null=True, blank=True)
    archivo_geo = models.FileField(upload_to='documentos/', max_length=255, null=True, blank=True)#adicion de codigo
    publicar = models.BooleanField(null=True, blank=True)#adicion de codigo

    class Meta:
        db_table = 'proyectos'
    
    def __str__(self):        
        return f'{self.nombre}'
