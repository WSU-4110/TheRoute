# UserAchievements/apps.py
from django.apps import AppConfig
from django.contrib.auth.signals import user_logged_in
import logging

class UserAchievementsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'UserAchievements'

    def ready(self):
        """
        Called when the app is ready.
        Ensures signals are registered and logs their status.
        """
        # Setup logging for debugging
        logger = logging.getLogger(__name__)

        # Debug log for app readiness
        logger.info("Initializing UserAchievements app...")

        try:
            # Import signals to register them
            import UserAchievements.signals
            logger.info("Signals for UserAchievements successfully registered.")
        except ImportError as e:
            logger.error(f"Error importing signals for UserAchievements: {e}")
            raise ImportError(f"Could not import signals: {e}")

        # Confirm the app is ready
        logger.info("UserAchievements app is ready.")
