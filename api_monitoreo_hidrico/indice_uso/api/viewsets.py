from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response

class IndiceUsoViewSet(viewsets.GenericViewSet):
    def list(self, request):
        print("entre")
        return Response({'message': 'Proyecto Reguistrado'}, status=status.HTTP_200_OK)