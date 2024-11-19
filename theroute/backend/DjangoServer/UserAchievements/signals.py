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


# Signal to award the 'Trip Planner' achievement
@receiver(post_save, sender=apps.get_model('trips', 'Trip'))  # Replace 'trips' with your app label
def award_trip_planner_achievement(sender, instance, created, **kwargs):
    """
    Awards the 'Trip Planner' achievement to the user upon successfully planning and setting up their first trip.
    """
    if created:  # Trigger only when a new trip is created
        Achievement = apps.get_model('achievements', 'Achievement')
        UserAchievement = apps.get_model('achievements', 'UserAchievement')

        try:
            # Fetch or create the 'Trip Planner' achievement
            trip_planner_achievement, _ = Achievement.objects.get_or_create(
                key='first_trip_planner',
                defaults={
                    'name': 'Trip Planner',
                    'description': 'Awarded for successfully planning and setting up your first trip.',
                    'category': 'Travel',
                    'bonus': 20,
                    'callback': 'trip_setup_callback',  # Optional callback if implemented
                }
            )
            # Award the achievement to the user
            UserAchievement.objects.get_or_create(user=instance.user, achievement=trip_planner_achievement)

            # Emit the custom signal
            achievement_unlocked.send(sender=sender, user=instance.user, achievement=trip_planner_achievement)
        except Exception as e:
            print(f"Error awarding 'Trip Planner' achievement: {e}")
