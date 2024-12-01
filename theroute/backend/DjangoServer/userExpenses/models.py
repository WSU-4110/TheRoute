from django.db import models
from django.conf import settings

class Expense(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    trip_name = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )
    category = models.CharField(
        max_length=50,
        choices=[
            ('food', 'Food'),
            ('transportation', 'Transportation'),
            ('activities', 'Activities'),
            ('housing', 'Housing'),
            ('shopping', 'Shopping'),
            ('other', 'Other'),
        ]
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # If trip_name is not set, generate it based on the ID after saving
        if not self.trip_name:
            # Save the object to generate the ID
            super().save(*args, **kwargs)
            # Now that we have an ID, update the trip_name
            self.trip_name = f"Trip {self.id}"
            # Update only the trip_name field in the database
            self.save(update_fields=['trip_name'])
        else:
            super().save(*args, **kwargs)  # Save normally if trip_name is already set

    def __str__(self):
        return f"{self.user.email} - {self.category} (${self.amount})"
