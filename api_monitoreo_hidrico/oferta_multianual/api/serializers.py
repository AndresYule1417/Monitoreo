from rest_framework import serializers

from oferta_multianual.models import OfertaMultiAnual

from proyectos.models import Proyectos
from proyectos.api.serializers import CreateProyectoSerializer

import pandas as pd
import os
from datetime import datetime

from api_db.cnx_db import CnxDb

#clase para serializar el modelo oferta multi-anual
class CreateOfertaMultiAnualSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfertaMultiAnual
        fields = "__all__"
    
    #funcion para guardar los datos
    def create(self, validated_data):       
        result = Proyectos.objects.filter(id=validated_data['id']).first()        
        if result:                       
            result_serializer = CreateProyectoSerializer(result)           
            if(result_serializer):
                fileName = "." + result_serializer.data['archivo']
                if os.path.exists(fileName): 
                    self.oferta_multianual(fileName, validated_data)                           
        
        #return super().create(validated_data)
        return True
    
    #funcion que lee el documento excel y guarda los datos en l base de datos
    def oferta_multianual(self, fileName, validated_data):
        df_rh_medio = pd.read_excel(fileName, sheet_name='OFERTA MULTIANUAL', skiprows=4, usecols="A:M")    
        df_rh_medio.rename(columns={'Unnamed: 0':'UA'}, inplace=True)                   

        df_rh_humedo = pd.read_excel(fileName, sheet_name='OFERTA MULTIANUAL', skiprows=4, usecols="P:AB")    
        df_rh_humedo.rename(columns={'Unnamed: 15':'UA'}, inplace=True)      

        df_rh_seco = pd.read_excel(fileName, sheet_name='OFERTA MULTIANUAL', skiprows=4, usecols="AD:AP")
        df_rh_seco.rename(columns={'Unnamed: 29':'UA'}, inplace=True)

        cnx = CnxDb()
        now = datetime.now()
        fecha = now.strftime("%Y-%m-%d")   
        hora = now.strftime("%H:%M")   

        columns = df_rh_medio.columns

        for i in range(df_rh_medio.shape[0]):           
            for j in range(df_rh_medio.shape[1]-1): 
                sql = "insert into oferta_multianual (id_proyecto, mes, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + columns[j+1] + "', '" + df_rh_medio.iloc[i]['UA'] + "', '" + str(df_rh_medio.iloc[i, j+1]) + "', 'medio', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)
        
        for i in range(df_rh_humedo.shape[0]):           
            for j in range(df_rh_humedo.shape[1]-1): 
                sql = "insert into oferta_multianual (id_proyecto, mes, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + columns[j+1] + "', '" + df_rh_humedo.iloc[i]['UA'] + "', '" + str(df_rh_humedo.iloc[i, j+1]) + "', 'humedo', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)
        
        for i in range(df_rh_seco.shape[0]):           
            for j in range(df_rh_seco.shape[1]-1): 
                sql = "insert into oferta_multianual (id_proyecto, mes, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + columns[j+1] + "', '" + df_rh_seco.iloc[i]['UA'] + "', '" + str(df_rh_seco.iloc[i, j+1]) + "', 'seco', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)