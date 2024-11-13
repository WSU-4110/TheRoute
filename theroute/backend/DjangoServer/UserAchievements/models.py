# achievements/models.py
from django.db import models
from django.conf import settings
#from django.contrib.auth.models import User

class Achievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    achieved = models.BooleanField(default=False)
    date_achieved = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name
