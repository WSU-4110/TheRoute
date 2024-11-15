# achievements/apps.py
from django.apps import AppConfig

class AchievementsConfig(AppConfig):
    name = 'achievements'

class UserAchievementsConfig(AppConfig):
    name = 'userachievements'

    def ready(self):
        import achievements.signals  # This will trigger the signal handler