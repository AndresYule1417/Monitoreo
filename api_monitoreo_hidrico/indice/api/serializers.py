from rest_framework import serializers

from rendimiento.models import Rendimiento

from proyectos.models import Proyectos
from proyectos.api.serializers import CreateProyectoSerializer

import pandas as pd
import os
from datetime import datetime

from api_db.cnx_db import CnxDb

#clase que serializa el modelo indice
class CreateIndiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rendimiento
        fields = "__all__"
    
    #funcion que verifica si existe el archivo
    def create(self, validated_data):       
        result = Proyectos.objects.filter(id=validated_data['id']).first()        
        if result:                       
            result_serializer = CreateProyectoSerializer(result)           
            if(result_serializer):
                fileName = "." + result_serializer.data['archivo']
                if os.path.exists(fileName): 
                    self.indice(fileName, validated_data)                           
        
        #return super().create(validated_data)
        return True
    
    #funcion que lee el docuemto excel y los datos los guarda en la base de datos
    def indice(self, fileName, validated_data):
        df_rh_medio = pd.read_excel(fileName, sheet_name='Indice_Medio')    
        df_rh_medio.rename(columns={'Unnamed: 0':'UA'}, inplace=True)                   

        df_rh_humedo = pd.read_excel(fileName, sheet_name='Indice_Seco')    
        df_rh_humedo.rename(columns={'Unnamed: 0':'UA'}, inplace=True)      

        df_rh_seco = pd.read_excel(fileName, sheet_name='Indice_Humedo')
        df_rh_seco.rename(columns={'Unnamed: 0':'UA'}, inplace=True)

        cnx = CnxDb()
        now = datetime.now()
        fecha = now.strftime("%Y-%m-%d")   
        hora = now.strftime("%H:%M")   

        columns = df_rh_medio.columns

        for i in range(df_rh_medio.shape[0]):           
            for j in range(df_rh_medio.shape[1]-1): 
                sql = "insert into indice (id_proyecto, mes, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + columns[j+1] + "', '" + df_rh_medio.iloc[i]['UA'] + "', '" + str(df_rh_medio.iloc[i, j+1].replace("'", "")) + "', 'medio', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)
        
        for i in range(df_rh_humedo.shape[0]):           
            for j in range(df_rh_humedo.shape[1]-1): 
                sql = "insert into indice (id_proyecto, mes, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + columns[j+1] + "', '" + df_rh_humedo.iloc[i]['UA'] + "', '" + str(df_rh_humedo.iloc[i, j+1].replace("'", "")) + "', 'seco', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)
        
        for i in range(df_rh_seco.shape[0]):           
            for j in range(df_rh_seco.shape[1]-1): 
                sql = "insert into indice (id_proyecto, mes, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + columns[j+1] + "', '" + df_rh_seco.iloc[i]['UA'] + "', '" + str(df_rh_seco.iloc[i, j+1].replace("'", "")) + "', 'humedo', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)