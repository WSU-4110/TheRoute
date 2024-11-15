import importlib
import types
import inspect
import logging

from django.core.exceptions import ImproperlyConfigured
from django.conf import settings
from django.db import models

from appconf import AppConf

logger = logging.getLogger(__name__)

def check_achievement_class(cls):
    return [attribute for attribute in ['name', 'key', 'description', 'bonus', 'evaluate'] if not hasattr(cls, attribute)]


def load_classes(classes=settings.ACHIEVEMENT_CLASSES, *args, **kwargs):
    # Remove South migration checks and simplify the method
    from achievements.engine import engine
    for achievement_module in classes:
        try:
            module = importlib.import_module(achievement_module)
            clses = [cls for name, cls in inspect.getmembers(module) if inspect.isclass(cls) and name.endswith('Achievement')]
            for cl in clses:
                errors = check_achievement_class(cl)
                if errors:
                    message = "Achievement class '%s' in '%s' has missing attributes : %s" % (cl.__name__, module.__name__, ",".join(errors))
                    logger.error(message)
                    raise ImproperlyConfigured(message)
                else:
                    logger.info("Registering achievement class %s..." % (cl))
                    engine.register_achievement(cl)
        except ImproperlyConfigured:
            raise
        except Exception as exc:
            logger.error("Exception caught while trying to register achievements class %s " % exc)
            raise ImproperlyConfigured("ACHIEVEMENT_CLASSES attribute must be set properly for them to be loaded into the engine : %s" % exc)


class Achievement(models.Model):
    """ These objects are what people are earning when contributing """
    name = models.CharField(max_length=75)
    key = models.CharField(max_length=75, unique=True)
    description = models.TextField(null=True, blank=True)
    category = models.CharField(default="", max_length=75)
    bonus = models.IntegerField(default=0)
    callback = models.TextField()

    def __unicode__(self):
        return "Achievement(%s, %s)" % (self.name, self.bonus)


class UserAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, related_name="userachievements", on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)


class AchievementEngineConf(AppConf):
    """ Configuration class used by Django AppConf to ease the setup"""
    USE_CELERY = False
    CLASSES = []

    class Meta:
        prefix = 'achievement'

    def configure_classes(self, value):
        pass

# Use standard Django signal handling
from django.db.models.signals import post_migrate
from django.dispatch import receiver

@receiver(post_migrate)
def load_classes(sender, **kwargs):
    # Your logic for loading classes goes here
    pass
