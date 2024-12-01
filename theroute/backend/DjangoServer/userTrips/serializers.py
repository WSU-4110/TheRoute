from rest_framework import serializers
from .models import TripDetails
from django.contrib.auth import get_user_model

User = get_user_model()

class TripDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripDetails
        fields = [
            'id',
            'trip_name',
            'start_location',
            'end_location',
            'trip_distance',
            'start_date',
            'end_date',
            'budget',
            'user'  # Included but handled by the view
        ]
        read_only_fields = ['user','id']  # Make 'user' read-only

    def create(self, validated_data):
        # Get the user from the request context
        user = self.context['request'].user
        # Add the user to the validated data
        validated_data['user'] = user
        # Create the TripDetails object with the updated validated data
        trip = TripDetails.objects.create(**validated_data)
        return trip

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance