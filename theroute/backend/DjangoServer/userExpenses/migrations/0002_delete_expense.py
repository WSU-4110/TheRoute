# Generated by Django 5.1.2 on 2024-10-17 22:01

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("userExpenses", "0001_initial"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Expense",
        ),
    ]
