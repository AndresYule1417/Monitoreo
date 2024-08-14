from django.db import models

class Proyectos(models.Model):
    nombre = models.CharField(max_length=64, null=False, blank=False)
    fecha = models.DateTimeField(null=False, blank=False)
    archivo = models.FileField(upload_to='documentos/', max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'proyectos'
    
    def __str__(self):        
        return f'{self.nombre}'
