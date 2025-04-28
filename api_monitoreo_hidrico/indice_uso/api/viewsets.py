from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response

import pandas as pd
from natsort import natsorted

from api_db.cnx_db import CnxDb_SZH

class IndiceUsoViewSet(viewsets.GenericViewSet):
    def list(self, request):
        sql = "select nombre_sub_zona, metrica, valor \
            from metricas_hidrologicas \
            left join sub_zonas_hidrograficas \
            on id_sub_cuenca = id_sub_zona \
            where metrica in ('CA', 'DH_M3PS','OHRD_N','IUA_N','CAT_IUA_N','Cat-IUA_N')"
        cnxDb = CnxDb_SZH()        
        if(cnxDb.get_cnx):
            result = cnxDb.getQueryAll(sql)
            data = pd.DataFrame(result)   

            data_pivot = data.pivot(index="nombre_sub_zona", columns="metrica", values="valor")
            data_pivot.columns.name = None
            orden = natsorted(data_pivot.index, reverse=True)           
            data_pivot.index = pd.CategoricalIndex(data_pivot.index, categories=orden, ordered=True)          
            data_pivot= data_pivot.sort_index()                    

            for col in data_pivot.columns:
                try:
                    data_pivot[col] = pd.to_numeric(data_pivot[col])
                except ValueError:
                    pass  # Si la conversión falla, significa que la columna no es numérica            
            
            data_pivot = data_pivot.round(3)   
            data_pivot_an = data_pivot.reset_index()  
            

        sql = "SELECT nombre_sub_zona, metrica, valor \
            FROM metricas_hidrologicas \
            LEFT JOIN sub_zonas_hidrograficas \
            ON id_sub_cuenca = id_sub_zona \
            WHERE metrica IN ('DH_M3PS', 'CA_S', 'OHRD_S', 'IUA_S', 'CAT_IUA_S', 'Cat-IUA_S')"    

         
        
        if(cnxDb.get_cnx):
            result = cnxDb.getQueryAll(sql)
            data = pd.DataFrame(result)

            data_pivot = data.pivot(index="nombre_sub_zona", columns="metrica", values="valor")
            data_pivot.columns.name = None
            orden = natsorted(data_pivot.index, reverse=True)           
            data_pivot.index = pd.CategoricalIndex(data_pivot.index, categories=orden, ordered=True)          
            data_pivot= data_pivot.sort_index()                    

            for col in data_pivot.columns:
                try:
                    data_pivot[col] = pd.to_numeric(data_pivot[col])
                except ValueError:
                    pass  # Si la conversión falla, significa que la columna no es numérica            
            
            data_pivot = data_pivot.round(3)   
            data_pivot_as = data_pivot.reset_index()
        
        return Response({'message':'success', 'data_pivot_an':data_pivot_an, 'data_pivot_as':data_pivot_as}, status=status.HTTP_200_OK) 
                

            