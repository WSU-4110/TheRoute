# Generated by Django 5.1.1 on 2024-11-18 16:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("userTrips", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="tripdetails",
            name="total_distance",
            field=models.DecimalField(
                blank=True, decimal_places=2, max_digits=10, null=True
            ),
        ),
        migrations.AddField(
            model_name="tripdetails",
            name="trip_time",
            field=models.DurationField(blank=True, null=True),
        ),
    ]