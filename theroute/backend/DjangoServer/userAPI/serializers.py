from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework.exceptions import ValidationError
from django.db import transaction, DatabaseError

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Make password unreadable in output

    class Meta:
        model = UserModel
        fields = '__all__'  # This will include all fields of the user model

    def create(self, validated_data):
        try:
            with transaction.atomic():  # Ensure atomic operation
                user_obj = UserModel.objects.create_user(
                    email=validated_data['email'],
                    password=validated_data['password']
                )
                user_obj.username = validated_data['username']
                user_obj.save()
            return user_obj
        except DatabaseError as e:
            raise ValidationError(f"Database error: {str(e)}")

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, validated_data):
        user = authenticate(username=validated_data['email'], password=validated_data['password'])
        if not user:
            raise ValidationError('Error. User not found')
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel  # Correctly define the model here
        fields = ('email', 'username')