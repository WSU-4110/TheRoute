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
        Achievement = apps.get_model('UserAchievements', 'Achievement')
        UserAchievement = apps.get_model('UserAchievements', 'UserAchievement')

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
@receiver(post_save, sender=apps.get_model('userTrips', 'TripDetails'))
def award_trip_planner_achievement(sender, instance, created, **kwargs):
    """
    Awards the 'Trip Planner' achievement to the user upon successfully planning their first trip.
    """
    if created:
        Achievement = apps.get_model('UserAchievements', 'Achievement')
        UserAchievement = apps.get_model('UserAchievements', 'UserAchievement')

        try:
            # Fetch or create the 'Trip Planner' achievement
            trip_planner_achievement, created = Achievement.objects.get_or_create(
                key='first_trip_planner',
                defaults={
                    'name': 'Trip Planner',
                    'description': 'Awarded for successfully planning your first trip.',
                    'category': 'Travel',
                    'bonus': 20,
                }
            )
            print(f"[DEBUG] 'Trip Planner' Achievement: {trip_planner_achievement}, Created: {created}")

            # Award the achievement only if the user doesn't already have it
            user_achievement, created = UserAchievement.objects.get_or_create(
                user=instance.user, achievement=trip_planner_achievement
            )
            if created:
                print(f"[DEBUG] 'Trip Planner' achievement awarded to user: {instance.user.username}")
            else:
                print(f"[DEBUG] User {instance.user.username} already has 'Trip Planner' achievement")
        except Exception as e:
            print(f"[DEBUG] Error awarding 'Trip Planner' achievement: {e}")


# Signal to award the 'First Expense' achievement
@receiver(post_save, sender=apps.get_model('userExpenses', 'Expense'))
def award_first_expense_achievement(sender, instance, created, **kwargs):
    """
    Awards the 'First Expense' achievement to the user upon creating their first expense.
    """
    if created:
        Achievement = apps.get_model('UserAchievements', 'Achievement')
        UserAchievement = apps.get_model('UserAchievements', 'UserAchievement')

        try:
            # Fetch or create the 'First Expense' achievement
            first_expense_achievement, created = Achievement.objects.get_or_create(
                key='first_expense',
                defaults={
                    'name': 'First Expense',
                    'description': 'Awarded for recording your first expense.',
                    'category': 'Finance',
                    'bonus': 10,
                }
            )
            print(f"[DEBUG] 'First Expense' Achievement: {first_expense_achievement}, Created: {created}")

            # Award the achievement only if the user doesn't already have it
            user_achievement, created = UserAchievement.objects.get_or_create(
                user=instance.user, achievement=first_expense_achievement
            )
            if created:
                print(f"[DEBUG] 'First Expense' achievement awarded to user: {instance.user.username}")
            else:
                print(f"[DEBUG] User {instance.user.username} already has 'First Expense' achievement")
        except Exception as e:
            print(f"[DEBUG] Error awarding 'First Expense' achievement: {e}")


# Signal to award the 'Planner Signup' achievement
@receiver(post_save, sender=User)
def award_planner_signup_achievement(sender, instance, created, **kwargs):
    """
    Awards the 'Planner Signup' achievement to the user upon successful signup.
    """
    if created:
        Achievement = apps.get_model('UserAchievements', 'Achievement')
        UserAchievement = apps.get_model('UserAchievements', 'UserAchievement')

        try:
            # Fetch or create the 'Planner Signup' achievement
            planner_signup_achievement, created = Achievement.objects.get_or_create(
                key='planner_signup',
                defaults={
                    'name': 'Planner Signup',
                    'description': 'Awarded for signing up to the planner.',
                    'category': 'Signup',
                    'bonus': 5,
                }
            )
            print(f"[DEBUG] 'Planner Signup' Achievement: {planner_signup_achievement}, Created: {created}")

            # Award the achievement to the user
            user_achievement, created = UserAchievement.objects.get_or_create(
                user=instance, achievement=planner_signup_achievement
            )
            if created:
                print(f"[DEBUG] 'Planner Signup' achievement awarded to user: {instance.username}")
            else:
                print(f"[DEBUG] User {instance.username} already has 'Planner Signup' achievement")
        except Exception as e:
            print(f"[DEBUG] Error awarding 'Planner Signup' achievement: {e}")
