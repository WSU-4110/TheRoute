# Generated by Django 5.1.1 on 2024-11-19 18:27

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("userTrips", "0004_alter_tripdetails_user_email"),
    ]

    operations = [
        migrations.RenameField(
            model_name="tripdetails",
            old_name="user_email",
            new_name="user",
        ),
    ]