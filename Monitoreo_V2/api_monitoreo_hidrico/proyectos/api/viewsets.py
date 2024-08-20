from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

import os
import pandas as pd
from json import loads, dumps

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