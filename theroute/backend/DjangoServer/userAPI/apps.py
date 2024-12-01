# userAPI/apps.py
from django.apps import AppConfig


class UserAPIConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'userAPI'

    def ready(self):
        try:
            import userAPI.signals  # Ensure signals are registered
            print("Signals for userAPI successfully registered.")
        except ImportError as e:
            print(f"Error importing signals for userAPI: {e}")
