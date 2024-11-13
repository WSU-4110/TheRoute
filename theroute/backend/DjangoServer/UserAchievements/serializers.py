# achievements/serializers.py
from rest_framework import serializers
from .models import Achievement

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'user', 'name', 'description', 'achieved', 'date_achieved']
