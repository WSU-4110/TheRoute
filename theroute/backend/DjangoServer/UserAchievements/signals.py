from django.dispatch import Signal, receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.db import transaction, IntegrityError
from django.contrib.auth.signals import user_logged_in
from django.apps import apps  # Lazy loading models

# Define the custom signal
achievement_unlocked = Signal()

# Ensure custom user model is used
User = get_user_model()

# Signal to award the 'First Login' achievement upon user login
@receiver(user_logged_in)
def award_first_login_achievement(sender, request, user, **kwargs):
    Achievement = apps.get_model("UserAchievements", "Achievement")
    UserAchievement = apps.get_model("UserAchievements", "UserAchievement")
    
    try:
        # Fetch or create the 'First Login' achievement
        first_login_achievement, _ = Achievement.objects.get_or_create(
            key="first_login",
            defaults={
                "name": "First Login",
                "description": "Awarded for logging in for the first time.",
                "category": "General",
                "bonus": 10,
            },
        )
        
        # Check if the user already has this achievement
        UserAchievement.objects.get_or_create(
            user=user,
            achievement=first_login_achievement,
        )
    
    except Exception:
        pass


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
            trip_planner_achievement, _ = Achievement.objects.get_or_create(
                key='first_trip_planner',
                defaults={
                    'name': 'Trip Planner',
                    'description': 'Awarded for successfully planning your first trip.',
                    'category': 'Travel',
                    'bonus': 20,
                }
            )

            # Award the achievement only if the user doesn't already have it
            UserAchievement.objects.get_or_create(user=instance.user, achievement=trip_planner_achievement)
        except Exception:
            pass


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
            first_expense_achievement, _ = Achievement.objects.get_or_create(
                key='first_expense',
                defaults={
                    'name': 'First Expense',
                    'description': 'Awarded for recording your first expense.',
                    'category': 'Finance',
                    'bonus': 10,
                }
            )

            # Award the achievement only if the user doesn't already have it
            if not UserAchievement.objects.filter(user=instance.user, achievement=first_expense_achievement).exists():
                UserAchievement.objects.create(user=instance.user, achievement=first_expense_achievement)
        except Exception:
            pass


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
            planner_signup_achievement, _ = Achievement.objects.get_or_create(
                key='planner_signup',
                defaults={
                    'name': 'Planner Signup',
                    'description': 'Awarded for signing up to the planner.',
                    'category': 'Signup',
                    'bonus': 5,
                }
            )

            # Award the achievement only if the user doesn't already have it
            UserAchievement.objects.get_or_create(user=instance, achievement=planner_signup_achievement)
        except Exception:
            pass
