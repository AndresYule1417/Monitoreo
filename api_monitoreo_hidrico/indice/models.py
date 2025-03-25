from django.db import models

from proyectos.models import Proyectos

#clase q crea el modelo indice y creal los campos en la base de datos
class Indice(models.Model):
    id_proyecto = models.ForeignKey(Proyectos, to_field='id', db_column='id_proyecto', on_delete=models.RESTRICT, null=False, blank=False)
    mes = models.CharField(max_length=6, null=False, blank=False)
    unidad_de_analisis = models.CharField(max_length=128, null=False, blank=False)
    valor = models.CharField(max_length=32, null=False, blank=False)
    tipo = models.CharField(max_length=16, null=False, blank=False)
    fech_digi = models.DateField(blank=False, null=False)
    hora_digi = models.TimeField(blank=False, null=False)

    class Meta:
        db_table = 'indice'
        unique_together = (("id_proyecto", "mes", "unidad_de_analisis", "tipo"))    
    
    def __str__(self):        
        return f'{self.id_proyecto} - {self.mes} - {self.unidad_de_analisis}'
