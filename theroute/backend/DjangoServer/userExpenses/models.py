from django.db import models
from django.conf import settings

class Expense(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='expenses'
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

    def __str__(self):
        return f"{self.user.email} - {self.category} (${self.amount})"