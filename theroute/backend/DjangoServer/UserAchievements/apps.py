# achievements/apps.py
from django.apps import AppConfig


class AchievementsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'  # Optional
    name = 'achievements'

    def ready(self):
        """
        Import signals to ensure they are registered when the app is loaded.
        This method is called once when the app is ready, ensuring signal handlers are active.
        """
        try:
            import achievements.signals  # Import signals to register them
        except ImportError as e:
            raise ImportError(f"Error importing signals in 'achievements': {e}")
