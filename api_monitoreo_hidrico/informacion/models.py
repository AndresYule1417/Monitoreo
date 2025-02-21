from django.db import models

from proyectos.models import Proyectos

class Informacion(models.Model):
    id_proyecto = models.ForeignKey(Proyectos, to_field='id', db_column='id_proyecto', on_delete=models.RESTRICT, null=False, blank=False)
    zona = models.CharField(max_length=64, null=False, blank=False)
    unidad_de_analisis = models.CharField(max_length=128, null=False, blank=False)
    coord_x = models.IntegerField(null=False, blank=False)
    coord_y = models.IntegerField(null=False, blank=False)
    desc_info = models.CharField(max_length=255, null=False, blank=False)
    tendencia_qanual_medio = models.CharField(max_length=32, null=False, blank=False)
    tendencia_qanual_minimo = models.CharField(max_length=32, null=False, blank=False)
    tendencia_qanual_maximo = models.CharField(max_length=32, null=False, blank=False)    
    fech_digi = models.DateField(blank=False, null=False)
    hora_digi = models.TimeField(blank=False, null=False)

    class Meta:
        db_table = 'informacion'
        unique_together = (("id_proyecto", "zona", "unidad_de_analisis"))    
    
    def __str__(self):        
        return f'{self.id_proyecto} - {self.zona} - {self.unidad_de_analisis}'