from rest_framework import serializers

import os

from proyectos.models import Proyectos

from api_monitoreo_hidrico import settings


#clase para interpretar los datos python a json
class CreateProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyectos#modelo a utilizar
        fields = "__all__"#llama a todos los campos  

#clase para interpretar los datos python a json
class UpdateProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyectos#modelo a utilizar
        fields = "__all__"#llama a todos los campos
    
    #funcion que gestiona un archivo para sobreescribir o actualizar
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
    
    #funcion que gestiona un archivo para sobreescribir o actualizar - adicion de codigo
    def validate_archivo_geo(self, value):              
        myPath = settings.MEDIA_ROOT + "/" + str(self.instance.archivo_geo)        
        try:
            if(os.path.exists(myPath) and value == None):            
                return self.instance.archivo_geo          
            if(os.path.exists(myPath) and value != None):            
                os.remove(myPath)            
                return value
        except:
            return value       
    
    #funcion que actualiza un proyecto
    def update(self, instance, validated_data):            
        instance.nombre = validated_data['nombre']
        instance.fecha = validated_data['fecha']
        instance.archivo = validated_data['archivo']    
        instance.archivo_geo = validated_data['archivo_geo']#adicion de codigo  
        instance.save()
        return instance  

#clase para interpretar los datos python a json y actualizar el estado de publicacion
class UpdatePublProySerializer(serializers.ModelSerializer):#adicion de codigo
    class Meta:
        model = Proyectos
        fields = ('id', 'publicar')

#clase para listar los proyectos que estan publicados
class ListProyectosSerializer(serializers.ModelSerializer):#adicion de codigo
    class Meta:
        model = Proyectos
        fields = ('id', 'nombre', 'publicar')




