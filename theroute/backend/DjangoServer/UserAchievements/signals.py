from django.dispatch import Signal, receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.apps import apps  # Lazy loading models

# Define the custom signal
achievement_unlocked = Signal()

# Signal to award the 'First Login' achievement
@receiver(post_save, sender=get_user_model())
def award_first_login_achievement(sender, instance, created, **kwargs):
    """
    Awards the 'First Login' achievement to the user upon account creation.
    """
    if created:
        Achievement = apps.get_model('achievements', 'Achievement')
        UserAchievement = apps.get_model('achievements', 'UserAchievement')

        try:
            # Fetch or create the 'first_login' achievement
            first_login_achievement, _ = Achievement.objects.get_or_create(
                key='first_login',
                defaults={'name': 'First Login', 'description': 'Awarded for logging in for the first time'}
            )
            # Award the achievement to the user
            UserAchievement.objects.get_or_create(user=instance, achievement=first_login_achievement)

            # Emit the custom signal
            achievement_unlocked.send(sender=sender, user=instance, achievement=first_login_achievement)
        except Exception as e:
            print(f"Error awarding 'First Login' achievement: {e}")
