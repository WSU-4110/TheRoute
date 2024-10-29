from rest_framework import serializers
from .models import Expense
from django.contrib.auth import get_user_model

User = get_user_model()

class ExpenseSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)  # Display email
    # No write access for 'user' field, it will be assigned automatically

    class Meta:
        model = Expense
        fields = ['id', 'email', 'category', 'amount', 'date']  # Include 'email' in fields
        read_only_fields = ['id', 'date', 'user']  # 'user' should be read-only

    def create(self, validated_data):
        # The 'user' field will be assigned later in the view
        return Expense.objects.create(**validated_data)