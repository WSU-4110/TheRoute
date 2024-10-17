from rest_framework.response import Response
from rest_framework.decorators import api_view
#from .models import Expense
#from .serializers import ExpenseSerializer

#@api_view(['POST'])
#def add_expense(request):
    #serializer = ExpenseSerializer(data=request.data)
    #if serializer.is_valid():
        #serializer.save()
        #return Response(serializer.data, status=201)
    #return Response(serializer.errors, status=400)

#@api_view(['GET'])
#def get_expenses(request):
    #expenses = Expense.objects.all()
    #serializer = ExpenseSerializer(expenses, many=True)
    #return Response(serializer.data)
    
#def delete_expenses(request):
