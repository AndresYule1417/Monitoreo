from rest_framework import serializers

from caudal.models import Caudal

from proyectos.models import Proyectos
from proyectos.api.serializers import CreateProyectoSerializer

import pandas as pd
import os
from datetime import datetime

from api_db.cnx_db import CnxDb

class CreateCaudalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caudal
        fields = "__all__"
    
    def create(self, validated_data):       
        result = Proyectos.objects.filter(id=validated_data['id']).first()        
        if result:                       
            result_serializer = CreateProyectoSerializer(result)           
            if(result_serializer):
                fileName = "." + result_serializer.data['archivo']
                if os.path.exists(fileName): 
                    self.caudal(fileName, validated_data)                           
        
        #return super().create(validated_data)
        return True
    
    def caudal(self, fileName, validated_data):
        df_q_medio = pd.read_excel(fileName, sheet_name='QAnual_med', skiprows=4)  
        df_q_minimo = pd.read_excel(fileName, sheet_name='QAnual_min', skiprows=4)  
        df_q_maximo = pd.read_excel(fileName, sheet_name='QAnual_max', skiprows=4)  

        df_lq_medio = pd.read_excel(fileName, sheet_name='Line_QAnual_med', skiprows=4)  
        df_lq_minimo = pd.read_excel(fileName, sheet_name='Line_QAnual_min', skiprows=4)  
        df_lq_maximo = pd.read_excel(fileName, sheet_name='Line_QAnual_max', skiprows=4)

        cnx = CnxDb()
        now = datetime.now()
        fecha = now.strftime("%Y-%m-%d")   
        hora = now.strftime("%H:%M")   

        columns = df_q_medio.columns

        for i in range(df_q_medio.shape[0]):           
            for j in range(df_q_medio.shape[1]-1):
                sql = "insert into caudal (id_proyecto, fecha, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + str(int(df_q_medio.iloc[i]['fecha'])) + "', '" + columns[j+1] + "', '" + str(df_q_medio.iloc[i, j+1]) + "', 'medio', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)
        
        for i in range(df_q_minimo.shape[0]):           
            for j in range(df_q_minimo.shape[1]-1):
                sql = "insert into caudal (id_proyecto, fecha, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + str(int(df_q_minimo.iloc[i]['fecha'])) + "', '" + columns[j+1] + "', '" + str(df_q_minimo.iloc[i, j+1]) + "', 'minimo', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)
        
        for i in range(df_q_maximo.shape[0]):           
            for j in range(df_q_maximo.shape[1]-1):
                sql = "insert into caudal (id_proyecto, fecha, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + str(int(df_q_maximo.iloc[i]['fecha'])) + "', '" + columns[j+1] + "', '" + str(df_q_maximo.iloc[i, j+1]) + "', 'maximo', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)

        for i in range(df_lq_medio.shape[0]):           
            for j in range(df_lq_medio.shape[1]-1):
                sql = "insert into caudal (id_proyecto, fecha, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + str(int(df_lq_medio.iloc[i]['fecha'])) + "', '" + columns[j+1] + "', '" + str(df_lq_medio.iloc[i, j+1]) + "', 'line_medio', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)
        
        for i in range(df_lq_minimo.shape[0]):           
            for j in range(df_lq_minimo.shape[1]-1):
                sql = "insert into caudal (id_proyecto, fecha, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + str(int(df_lq_minimo.iloc[i]['fecha'])) + "', '" + columns[j+1] + "', '" + str(df_lq_minimo.iloc[i, j+1]) + "', 'line_minimo', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)
        
        for i in range(df_lq_maximo.shape[0]):           
            for j in range(df_lq_maximo.shape[1]-1):
                sql = "insert into caudal (id_proyecto, fecha, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + str(int(df_lq_maximo.iloc[i]['fecha'])) + "', '" + columns[j+1] + "', '" + str(df_lq_maximo.iloc[i, j+1]) + "', 'line_maximo', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)
        

                
                    