# Generated by Django 5.1.1 on 2024-11-30 21:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("userExpenses", "0005_remove_expense_trip_expense_trip_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="expense",
            name="trip_name",
            field=models.CharField(blank=True, default=None, max_length=100, null=True),
        ),
    ]
