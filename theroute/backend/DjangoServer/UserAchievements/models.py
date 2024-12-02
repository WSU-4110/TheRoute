from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()  # Use the dynamic user model

class Achievement(models.Model):
    """These objects are what people are earning when contributing."""
    name = models.CharField(max_length=75)
    key = models.CharField(max_length=75, unique=True)
    description = models.TextField(null=True, blank=True)
    category = models.CharField(default="", max_length=75)
    bonus = models.IntegerField(default=0)
    callback = models.TextField()

    def __str__(self):
        return f"Achievement({self.name}, {self.bonus})"

class UserAchievement(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='achievement_userachievements'
    )
    achievement = models.ForeignKey(
        'UserAchievements.Achievement',  # Corrected reference
        on_delete=models.CASCADE,
        related_name='achievement_userachievements'
    )
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"
