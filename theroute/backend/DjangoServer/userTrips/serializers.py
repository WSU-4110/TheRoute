from rest_framework import serializers
from .models import TripDetails

# Updated serializer for TripDetails model excluding the stops
class TripDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripDetails
        fields = '__all__'

    def create(self, validated_data):
        # Create TripDetails instance without handling stops
        trip = TripDetails.objects.create(**validated_data)
        return trip

    def update(self, instance, validated_data):
        # Update the TripDetails instance without handling stops
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
