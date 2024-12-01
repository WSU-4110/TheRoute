# achievements/utils.py
import importlib
import logging
from django.db.models.aggregates import Sum
from django.contrib.auth import get_user_model
from django.apps import apps  # Lazy model loading to avoid circular imports

logger = logging.getLogger(__name__)
User = get_user_model()  # Dynamically fetch the User model


def get_user_score(user):
    """
    Compute the score of a given user based on their Achievement's bonuses.
    """
    UserAchievement = apps.get_model('achievements', 'UserAchievement')
    return (
        UserAchievement.objects.filter(user=user)
        .aggregate(score=Sum('achievement__bonus'))['score']
        or 0  # Default to 0 if no achievements
    )


def award_achievement(user, achievement_key):
    """
    Award an achievement to a user based on the provided achievement key.
    """
    logger.debug(f"Attempting to award achievement '{achievement_key}' to user '{user.email}'")
    try:
        # Lazy model loading to avoid circular import issues
        Achievement = apps.get_model('achievements', 'Achievement')
        UserAchievement = apps.get_model('achievements', 'UserAchievement')

        # Check if the user already has the achievement
        if not UserAchievement.objects.filter(user=user, achievement__key=achievement_key).exists():
            # Retrieve the achievement instance
            achievement = Achievement.objects.get(key=achievement_key)

            # Create a UserAchievement instance
            UserAchievement.objects.create(user=user, achievement=achievement)

            # Lazily import the signal to avoid circular import
            from .signals import achievement_unlocked
            achievement_unlocked.send(
                sender=award_achievement,
                user=user,
                achievement=achievement
            )

            logger.info(f"Achievement '{achievement_key}' awarded successfully to user '{user.email}'")
        else:
            logger.info(f"User '{user.email}' already has achievement '{achievement_key}'")
    except Achievement.DoesNotExist:
        logger.error(f"Achievement with key '{achievement_key}' does not exist.")
    except Exception as e:
        logger.error(f"An error occurred while awarding the achievement: {e}")


def evaluate_achievement_callback(user, obj, *args, **kwargs):
    """
    Evaluate the callback of an achievement to determine if it should be unlocked for the user.
    """
    achievement = get_callback_object(obj.callback)
    return achievement().evaluate(user, *args, **kwargs)


def construct_callback(obj):
    """
    Constructs a callback reference for an object.
    """
    logger.debug(f"Constructing callback from {obj}: {obj.__module__}.{obj.__name__}")
    return f"{obj.__module__}.{obj.__name__}"


def get_callback_object(ref):
    """
    Retrieves a callback object from a reference string.
    """
    module = ".".join(ref.split(".")[:-1])
    class_name = ref.split(".")[-1]
    m = importlib.import_module(module)
    return getattr(m, class_name)