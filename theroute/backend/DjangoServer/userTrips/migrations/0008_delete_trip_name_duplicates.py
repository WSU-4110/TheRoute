from django.db import migrations, models

def remove_duplicates(apps, schema_editor):
    TripDetails = apps.get_model('userTrips', 'TripDetails')  # Replace 'userTrips' with the actual app name if it's different
    
    # Remove duplicates, keeping only the first record for each trip_name
    duplicates = TripDetails.objects.values('trip_name').annotate(count=models.Count('trip_name')).filter(count__gt=1)
    
    for duplicate in duplicates:
        trip_name = duplicate['trip_name']
        duplicate_trips = TripDetails.objects.filter(trip_name=trip_name).order_by('id')[1:]  # Exclude the first one
        
        # Delete all but the first duplicate
        for trip in duplicate_trips:
            trip.delete()  # Delete each duplicate individually
class Migration(migrations.Migration):

    dependencies = [
        ("userTrips", "0006_remove_tripdetails_stops_delete_tripstop"),  # Update with the correct previous migration if needed
    ]

    operations = [
        migrations.RunPython(remove_duplicates),  # Remove duplicate trip names
        migrations.AlterField(
            model_name="tripdetails",
            name="trip_name",
            field=models.CharField(max_length=100, unique=True),
        ),  # Ensure the trip_name field is unique
    ]
