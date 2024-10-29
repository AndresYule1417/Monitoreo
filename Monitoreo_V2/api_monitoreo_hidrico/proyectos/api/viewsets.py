from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

import os
import pandas as pd
from json import loads, dumps

import re
import ast

from proyectos.api.serializers import CreateProyectoSerializer, UpdateProyectoSerializer
from proyectos.models import Proyectos

class ProyectosViewSet(viewsets.GenericViewSet):
    model: Proyectos
    serializer_class = CreateProyectoSerializer

    #funcion que resive la peticion POST con datos y crea un nuevo proyecto
    def create(self, request):        
        serializer = self.serializer_class(data=request.data)
        if(serializer.is_valid()):
            serializer.save()
            return Response({'message': 'Proyecto Reguistrado'}, status=status.HTTP_201_CREATED)             
        return Response({'message': 'Error en Registro', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    #Funcion que resive la peticion get y retorna un a lista de datos
    def list(self, request):
        result = self.serializer_class().Meta.model.objects.all()
        resultSerializer = self.serializer_class(result, many=True)        
        return Response(resultSerializer.data, status=status.HTTP_200_OK)

    #Funcion que resive la peticion delete y elimina el reguistro de un proyecto y su archivo asociado
    def destroy(self, request, pk=None): 
        result = self.serializer_class().Meta.model.objects.filter(id=pk).first()
        #if(result[0] != 0):
        if result:            
            result_serializer = self.serializer_class(result)  
            archivo = "." + str(result_serializer.data['archivo'])            
            if(os.path.exists(archivo)):
                os.remove(archivo) 
            
            result_delete = result.delete()       
            if(result_delete[0] != 0):
                return Response({'message': 'Proyecto eliminado'}, status=status.HTTP_200_OK)
        return Response({'message': 'No existe proyecto'}, status=status.HTTP_404_NOT_FOUND) 
    
    #funcion que resibe la peticion put para actualizar un proyecto
    def update(self, request, pk=None):        
        result = UpdateProyectoSerializer().Meta.model.objects.filter(id=pk).first()          
        if(result):                    
            result_serializer = UpdateProyectoSerializer(result, data=request.data)                                        
            if result_serializer.is_valid():                                  
                return Response({'message': 'Proyecto actualizado'}, status=status.HTTP_200_OK)            
            return Response({'message': 'error', 'error': result_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    #funcion que resive la peticion get con el id de parametro y retorna los datos del proyecto
    #y la lectura del documento excel del rendimiento hidrico
    def retrieve(self, request, pk=None):
        result = self.serializer_class().Meta.model.objects.filter(id=pk).first()
        if result:            
            result_serializer = self.serializer_class(result)           
            fileName = "." + result_serializer.data['archivo']        
            if os.path.exists(fileName):        
                df_rham = pd.read_excel(fileName, sheet_name='RENDIMIENTO HÍDRICO', skiprows=4, usecols="A:M")  
                df_rham.rename(columns={'Unnamed: 0':'UA'}, inplace=True)
                df_rham = df_rham.reset_index(drop=True).set_index('UA')
                result1 = df_rham.to_json(orient="split")
                parsed1 = loads(result1)                      

                df_rhah = pd.read_excel(fileName, sheet_name='RENDIMIENTO HÍDRICO', skiprows=4, usecols="P:AB")
                df_rhah.rename(columns={'Unnamed: 15':'UA'}, inplace=True)
                df_rhah = df_rhah.reset_index(drop=True).set_index('UA')
                result2 = df_rhah.to_json(orient="split")
                parsed2 = loads(result2)            

                df_rhas = pd.read_excel(fileName, sheet_name='RENDIMIENTO HÍDRICO', skiprows=4, usecols="AD:AP")
                df_rhas.rename(columns={'Unnamed: 29':'UA'}, inplace=True)
                df_rhas = df_rhas.reset_index(drop=True).set_index('UA')
                result3 = df_rhas.to_json(orient="split")
                parsed3 = loads(result3)                     

            return Response(data={"project":result_serializer.data, "xlsx":{"rham": parsed1, "rhah": parsed2, "rhas": parsed3}}, status=status.HTTP_200_OK)
        return Response({'error':'No existe proyecto'}, status=status.HTTP_400_BAD_REQUEST) 
    
    #peticion para retornar datos y  graficar LA OFERTA HIDRICA TOTAL SUPERFICIAL OHTS
    @action(detail=True, methods=['get']) 
    def retrieve_ohts(self, request, pk=None):
        result = self.serializer_class().Meta.model.objects.filter(id=pk).first()#consulta que retorna el dato con la llave primaria
        if result:            
            result_serializer = self.serializer_class(result)           
            fileName = "." + result_serializer.data['archivo']#se optiene la ruta del archivo 
            if os.path.exists(fileName):#si el archivo existe se procede a leer el excel y obtener los dataframe        
                df_info = pd.read_excel(fileName, sheet_name='INFO', skiprows=4, usecols="A:G")  
                result1 = df_info.to_json(orient="records")
                parsed1 = loads(result1)

                df_ofer_diar = pd.read_excel(fileName, sheet_name='OFERTA TOTAL DIARIA (m3s-1)')#OFERTA TOTAL DIARIA (m3s-1)
                df_ofer_diar['fecha'] = df_ofer_diar['fecha'].astype(str)
                df_ofer_diar = df_ofer_diar.reset_index(drop=True).set_index('fecha')    
                df_ofer_diar = df_ofer_diar.T#comentar           
                result3 = df_ofer_diar.to_json(orient="split")
                parsed3 = loads(result3)                

                df_ofer_mens = pd.read_excel(fileName, sheet_name='OFERTA TOTAL MENSUAL (m3s-1)')#OFERTA TOTAL MENSUAL (m3s-1)
                df_ofer_mens['fecha'] = df_ofer_mens['fecha'].astype(str)
                dfQstemp = df_ofer_mens.copy(deep=True)
                dfQstemp['Mes'] = pd.DatetimeIndex(dfQstemp['fecha']).month 
                dfQstemp['Mes_n'] = pd.DatetimeIndex(dfQstemp['fecha']).month_name()
                df_ofer_mens = df_ofer_mens.reset_index(drop=True).set_index('fecha') 
                dfQstemp = dfQstemp.reset_index(drop=True).set_index('fecha')               

                data4 = []             
                for item in range(len(df_ofer_mens.columns)):                    
                    Qm_mes = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].mean()
                    Qq5 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.05)
                    Qq10 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.10)
                    Qq15 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.15)
                    Qq20 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.20)
                    Qq25 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.25)
                    Qq30 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.30)
                    Qq35 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.35)
                    Qq40 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.40)
                    Qq45 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.45)
                    Qq50 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.50)#mediana
                    Qq55 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.55)
                    Qq60 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.60)
                    Qq65 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.65)
                    Qq70 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.70)
                    Qq75 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.75)
                    Qq80 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.80)
                    Qq85 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.85)
                    Qq90 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.90)
                    Qq95 = dfQstemp.groupby('Mes_n')[dfQstemp.columns[item]].quantile(0.95)
                    
                    Qm_mes.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq5.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq10.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq15.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq20.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq25.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq30.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq35.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq40.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq45.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq50.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)#mediana
                    Qq55.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq60.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq65.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq70.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq75.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq80.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq85.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq90.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    Qq95.rename(index={'April':'Abr','August':'Ago','March':'Mar','December':'Dic','February':'Feb','January':'Ene','July':'Jul','June':'Jun','November':'Nov','October':'Oct','September':'Sep'},inplace=True)
                    
                    new_order = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
                    Qm_mes = Qm_mes.reindex(new_order, axis=0)
                    Qq5 = Qq5.reindex(new_order, axis=0)
                    Qq10 = Qq10.reindex(new_order, axis=0)
                    Qq15 = Qq15.reindex(new_order, axis=0)
                    Qq20 = Qq20.reindex(new_order, axis=0)
                    Qq25 = Qq25.reindex(new_order, axis=0)
                    Qq30 = Qq30.reindex(new_order, axis=0)
                    Qq35 = Qq35.reindex(new_order, axis=0)
                    Qq40 = Qq40.reindex(new_order, axis=0)
                    Qq45 = Qq45.reindex(new_order, axis=0)
                    Qq50 = Qq50.reindex(new_order, axis=0)#mediana
                    Qq55 = Qq55.reindex(new_order, axis=0)
                    Qq60 = Qq60.reindex(new_order, axis=0)
                    Qq65 = Qq65.reindex(new_order, axis=0)
                    Qq70 = Qq70.reindex(new_order, axis=0)
                    Qq75 = Qq75.reindex(new_order, axis=0)
                    Qq80 = Qq80.reindex(new_order, axis=0)
                    Qq85 = Qq85.reindex(new_order, axis=0)
                    Qq90 = Qq90.reindex(new_order, axis=0)
                    Qq95 = Qq95.reindex(new_order, axis=0)                   

                    #recoleccion de datos de los percentiles
                    data4.append({"index":new_order, "data4": {"Qm_mes":Qm_mes, "Qq5":Qq5, "Qq10":Qq10, "Qq15":Qq15, "Qq20":Qq20, "Qq25":Qq25, "Qq30":Qq30, "Qq35":Qq35, "Qq40":Qq40, "Qq45":Qq45, "Qq50":Qq50, "Qq55":Qq55, "Qq60":Qq60, "Qq65":Qq65, "Qq70":Qq70, "Qq75":Qq75, "Qq80":Qq80, "Qq85":Qq85, "Qq90":Qq90, "Qq95":Qq95}})

                df_rham = pd.read_excel(fileName, sheet_name='ESCORRENTIA', skiprows=4, usecols="A:M")  
                df_rham.rename(columns={'Unnamed: 0':'UA'}, inplace=True)
                df_rham = df_rham.reset_index(drop=True).set_index('UA')
                result1 = df_rham.to_json(orient="split")
                data5 = loads(result1)                      

                df_rhah = pd.read_excel(fileName, sheet_name='ESCORRENTIA', skiprows=4, usecols="P:AB")
                df_rhah.rename(columns={'Unnamed: 15':'UA'}, inplace=True)
                df_rhah = df_rhah.reset_index(drop=True).set_index('UA')
                result2 = df_rhah.to_json(orient="split")
                data6 = loads(result2)            

                df_rhas = pd.read_excel(fileName, sheet_name='ESCORRENTIA', skiprows=4, usecols="AD:AP")
                df_rhas.rename(columns={'Unnamed: 29':'UA'}, inplace=True)
                df_rhas = df_rhas.reset_index(drop=True).set_index('UA')
                result3 = df_rhas.to_json(orient="split")
                data7 = loads(result3)

                q_anual_med = pd.read_excel(fileName, sheet_name='QAnual_med', skiprows=4)  
                q_anual_med['fecha'] = q_anual_med['fecha'].astype(str)
                q_anual_med = q_anual_med.reset_index(drop=True).set_index('fecha')    
                q_anual_med = q_anual_med.T#comentar           
                res8 = q_anual_med.to_json(orient="split")
                qamed= loads(res8) 

                q_anual_min = pd.read_excel(fileName, sheet_name='QAnual_min', skiprows=4)  
                q_anual_min['fecha'] = q_anual_min['fecha'].astype(str)
                q_anual_min = q_anual_min.reset_index(drop=True).set_index('fecha')    
                q_anual_min = q_anual_min.T#comentar           
                res8 = q_anual_min.to_json(orient="split")
                qamin= loads(res8)              

                q_anual_max = pd.read_excel(fileName, sheet_name='QAnual_max', skiprows=4)  
                q_anual_max['fecha'] = q_anual_max['fecha'].astype(str)
                q_anual_max = q_anual_max.reset_index(drop=True).set_index('fecha')    
                q_anual_max = q_anual_max.T#comentar           
                res8 = q_anual_max.to_json(orient="split")
                qamax= loads(res8)    

                l_anual_med = pd.read_excel(fileName, sheet_name='Line_QAnual_med', skiprows=4)  
                l_anual_med['fecha'] = l_anual_med['fecha'].astype(str)
                l_anual_med = l_anual_med.reset_index(drop=True).set_index('fecha')    
                l_anual_med = l_anual_med.T         
                res81 = l_anual_med.to_json(orient="split")
                lamed = loads(res81)    

                l_anual_min = pd.read_excel(fileName, sheet_name='Line_QAnual_min', skiprows=4)  
                l_anual_min['fecha'] = l_anual_min['fecha'].astype(str)
                l_anual_min = l_anual_min.reset_index(drop=True).set_index('fecha')    
                l_anual_min = l_anual_min.T     
                res81 = l_anual_min.to_json(orient="split")
                lamin= loads(res81)   

                l_anual_max = pd.read_excel(fileName, sheet_name='Line_QAnual_max', skiprows=4)  
                l_anual_max['fecha'] = l_anual_max['fecha'].astype(str)
                l_anual_max = l_anual_max.reset_index(drop=True).set_index('fecha')    
                l_anual_max = l_anual_max.T#comentar           
                res81 = l_anual_max.to_json(orient="split")
                lamax= loads(res81)    

                df_gp = pd.read_excel(fileName, sheet_name='Mapa_Geopandas_UHA', usecols=['Nombre_1', 'Nombre_SZH', 'geometry'])  
                json_tota = []
                

                """for item in range(len(df_gp)):
                    list_string = list(df_gp['geometry'][item].split(","))
                    list_string.pop() 
                    json_df = []
                    json_tota.append(json_df)   
                    if(item=):                            
                        for item1 in list_string:
                            item_array = re.findall(r"[-+]?\d*\.?\d+|[-+]?\d+", item1)                        
                            json_df.append({'lat':float(item_array[1]), 'lng':float(item_array[0])})"""

                list_of_dicts = ast.literal_eval(df_gp['geometry'][0])
                print(len(list_of_dicts))

                #list_of_dicts = ast.literal_eval(df_gp['geometry'][1])
                #print(len(list_of_dicts))

                #list_of_dicts = ast.literal_eval(df_gp['geometry'][2])
                #print(len(list_of_dicts))
                
                

  

                      
                    
                        



        print(json_tota)
                        
        json_tota = [
            {'lat': 47, 'lng': 20}, 
            {'lat': 47, 'lng': 20},
            {'lat': 47, 'lng': 20},
            {'lat': 47, 'lng': 20},
            {'lat': 47, 'lng': 20},
            {'lat': 47, 'lng': 20},
            {'lat': 47, 'lng': 20}, 
            {'lat': 47, 'lng': 20}, 
            {'lat': 47, 'lng': 20}, 
            {'lat': 47, 'lng': 20},
        ]                   

        #respuesta de todos los datos para graficar cada imagen     
        return Response({'data1':parsed1, 'data2':list_of_dicts, 'data3':parsed3, 'data4':data4, 'data5':data5, 'data6':data6, 'data7':data7, 'data8': {'qamed':qamed, 'qamin':qamin, 'qamax':qamax, 'lamed':lamed, 'lamin':lamin, 'lamax':lamax}}, status=status.HTTP_201_CREATED)        
