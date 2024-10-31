from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def check_user(self, validated_data):
        user = authenticate(
            username=validated_data['email'], 
            password=validated_data['password']
        )
        if not user:
            raise ValidationError('Error: Invalid credentials')
        return user
