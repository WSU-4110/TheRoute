# Generated by Django 5.1.1 on 2024-11-19 16:14

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("userTrips", "0002_tripdetails_total_distance_tripdetails_trip_time"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="tripdetails",
            options={},
        ),
        migrations.RemoveField(
            model_name="tripdetails",
            name="total_distance",
        ),
        migrations.RemoveField(
            model_name="tripdetails",
            name="trip_time",
        ),
        migrations.RemoveField(
            model_name="tripdetails",
            name="user",
        ),
        migrations.AddField(
            model_name="tripdetails",
            name="trip_distance",
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name="tripdetails",
            name="user_email",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="tripstop",
            name="latitude",
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="tripstop",
            name="longitude",
            field=models.FloatField(default=0.0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="tripdetails",
            name="budget",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="tripdetails",
            name="end_date",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="tripdetails",
            name="stops",
            field=models.ManyToManyField(related_name="trips", to="userTrips.tripstop"),
        ),
    ]
