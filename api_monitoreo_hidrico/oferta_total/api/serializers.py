from rest_framework import serializers

from oferta_multianual.models import OfertaMultiAnual

from proyectos.models import Proyectos
from proyectos.api.serializers import CreateProyectoSerializer

import pandas as pd
import os
from datetime import datetime

from api_db.cnx_db import CnxDb

#clase para serailizar el modelo oferta total
class CreateOfertaTotalSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfertaMultiAnual
        fields = "__all__"
    
    #funcion para guardar datos
    def create(self, validated_data):          
        result = Proyectos.objects.filter(id=validated_data['id']).first()        
        if result:                       
            result_serializer = CreateProyectoSerializer(result)           
            if(result_serializer):
                fileName = "." + result_serializer.data['archivo']
                if os.path.exists(fileName): 
                    self.oferta_total(fileName, validated_data)                           
        
        #return super().create(validated_data)
        return True
    
    #funcion que lee el documento excel y los datos los guarda en la base de datos
    def oferta_total(self, fileName, validated_data):
        df_rh_medio = pd.read_excel(fileName, sheet_name='OFERTA TOTAL DIARIA (m3s-1)')                    

        df_rh_humedo = pd.read_excel(fileName, sheet_name='OFERTA TOTAL MENSUAL (m3s-1)')          

        cnx = CnxDb()
        now = datetime.now()
        fecha = now.strftime("%Y-%m-%d")   
        hora = now.strftime("%H:%M")   

        columns = df_rh_medio.columns       

        for i in range(df_rh_medio.shape[0]):           
            for j in range(df_rh_medio.shape[1]-1):
                sql = "insert into oferta_total (id_proyecto, fecha, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + str(df_rh_medio.iloc[i]['fecha']) + "', '" + columns[j+1] + "', '" + str(df_rh_medio.iloc[i, j+1]) + "', 'oferta_diaria', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)
        
        for i in range(df_rh_humedo.shape[0]):           
            for j in range(df_rh_humedo.shape[1]-1):
                sql = "insert into oferta_total (id_proyecto, fecha, unidad_de_analisis, valor, tipo, fech_digi, hora_digi) \
                    values ('" + str(validated_data['id']) + "', '" + str(df_rh_humedo.iloc[i]['fecha']) + "', '" + columns[j+1] + "', '" + str(df_rh_humedo.iloc[i, j+1]) + "', 'oferta_mensual', '" + fecha + "', '" + hora + "')"
                if(cnx.get_cnx()):
                    cnx.insert_sql(sql)