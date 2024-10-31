from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework.exceptions import ValidationError
from django.db import transaction, DatabaseError

UserModel = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel  # Correctly define the model here
        fields = ('email', 'username')