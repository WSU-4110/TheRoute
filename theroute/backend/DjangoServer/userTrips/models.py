from django.db import models
from django.conf import settings

# Updated TripDetails model without stops
class TripDetails(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips')
    trip_name = models.CharField(max_length=100)
    start_location = models.CharField(max_length=100)
    end_location = models.CharField(max_length=100)
    trip_distance = models.FloatField(default=0)  # Setting the default value to 0
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    budget = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.trip_name

