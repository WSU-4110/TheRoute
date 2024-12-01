from rest_framework import serializers
from .models import Achievement, UserAchievement


class AchievementSerializer(serializers.ModelSerializer):
    """
    Serializer for Achievement model to expose all details.
    """
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'key', 'description', 'category', 'bonus', 'callback']


class UserAchievementSerializer(serializers.ModelSerializer):
    """
    Serializer for UserAchievement model to link a user with achievements.
    Includes nested Achievement details.
    """
    achievement = AchievementSerializer()  # Embed Achievement details

    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'registered_at']
