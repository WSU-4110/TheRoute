from rest_framework import serializers
from .models import Expense
from django.contrib.auth import get_user_model

User = get_user_model()

class ExpenseSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'email', 'category', 'amount', 'date']
        read_only_fields = ['id', 'date', 'user']

    def create(self, validated_data):
        return Expense.objects.create(**validated_data)