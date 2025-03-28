from rest_framework import serializers

from informacion.models import Informacion

from proyectos.models import Proyectos
from proyectos.api.serializers import CreateProyectoSerializer

import pandas as pd
import os
from datetime import datetime

from api_db.cnx_db import CnxDb

class CreateInformacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Informacion
        fields = "__all__"
    
    def create(self, validated_data):       
        result = Proyectos.objects.filter(id=validated_data['id']).first()        
        if result:                       
            result_serializer = CreateProyectoSerializer(result)           
            if(result_serializer):
                fileName = "." + result_serializer.data['archivo']
                if os.path.exists(fileName): 
                    self.informacion(fileName, validated_data)                               
        
        #return super().create(validated_data)
        return True    

    def informacion(self, fileName, validated_data):
        df_informacion = pd.read_excel(fileName, sheet_name='INFO', skiprows=4, usecols="A:G")    
        cnx = CnxDb()
        now = datetime.now()
        fecha = now.strftime("%Y-%m-%d")   
        hora = now.strftime("%H:%M")   
        for item in range(len(df_informacion)):
            sql = "insert into informacion (id_proyecto, zona, unidad_de_analisis, coord_x, coord_y, desc_info, tendencia_qanual_medio, tendencia_qanual_minimo, tendencia_qanual_maximo, fech_digi, hora_digi) \
                values ('" + str(validated_data['id']) + "', 'lucas', '" + df_informacion.iloc[item]['Unidad de analisis'] + "', '" + str(df_informacion.iloc[item]['coord_x']) + "', '" + str(df_informacion.iloc[item]['coord_y']) + "', '" + str(df_informacion.iloc[item]['desc_info']) + "', '" + df_informacion.iloc[item]['Tendencia QAnual_medio'] + "', '" + df_informacion.iloc[item]['Tendencia QAnual_minimo'] + "', '" + df_informacion.iloc[item]['Tendencia QAnual_maximo'] + "', '" + fecha + "', '" + hora + "')"
            if(cnx.get_cnx()):
                cnx.insert_sql(sql)
    
    def destroy(self, pk=None): 
        result = self.Meta().model.objects.filter(id_proyecto=pk)       
        if(result):               
            result_delete = result.delete() 
            if(result_delete):
                return True
        return False