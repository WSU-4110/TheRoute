# userAPI/apps.py

from django.apps import AppConfig

class UserApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'userAPI'

    def ready(self):
        import userAPI.signals  # Import signals to ensure they're registered
