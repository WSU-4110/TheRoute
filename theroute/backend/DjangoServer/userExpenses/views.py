from rest_framework import viewsets, permissions
from .models import Expense
from .serializers import ExpenseSerializer
from rest_framework.response import Response
from rest_framework.decorators import action

class ExpenseView(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter expenses for the logged-in user
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Assign the logged-in user to the expense
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['delete'])
    def delete_expense(self, request, pk=None):
        expense = self.get_object()
        if expense.user != request.user:
            return Response({"error": "You are not allowed to delete this expense."}, status=403)
        expense.delete()
        return Response({"success": "Expense deleted successfully."})