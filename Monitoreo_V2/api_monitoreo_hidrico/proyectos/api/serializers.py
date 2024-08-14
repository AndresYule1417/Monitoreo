from rest_framework import serializers

import os

from proyectos.models import Proyectos

from api_monitoreo_hidrico import settings

class CreateProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyectos
        fields = "__all__"

class UpdateProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyectos
        fields = "__all__"
    
    def validate_archivo(self, value):              
        myPath = settings.MEDIA_ROOT + "/" + str(self.instance.archivo)        
        try:
            if(os.path.exists(myPath) and value == None):            
                return self.instance.archivo            
            if(os.path.exists(myPath) and value != None):            
                os.remove(myPath)            
                return value
        except:
            return value       
    
    def update(self, instance, validated_data):            
        instance.nombre = validated_data['nombre']
        instance.fecha = validated_data['fecha']
        instance.archivo = validated_data['archivo']        
        instance.save()
        return instance  