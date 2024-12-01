
#from rest_framework import viewsets, permissions
#from rest_framework.response import Response
#from .models import TripDetails
#from .serializers import TripDetailsSerializer

#class TripDetailsViewSet(viewsets.ModelViewSet):
    #serializer_class = TripDetailsSerializer
    #permission_classes = [permissions.IsAuthenticated]

    #def get_queryset(self):
        # Only show trips that belong to the authenticated user
        #return TripDetails.objects.filter(user=self.request.user)

    #def perform_create(self, serializer):
        # Save the trip with the authenticated user as the owner
        #serializer.save(user=self.request.user)

    #def delete_trip(self, request, *args, **kwargs):
        # Override the destroy method to ensure the user can only delete their own trips
        #trip = self.get_object()
        #if trip.user != request.user:
            #return Response({"error": "You are not allowed to delete this trip."}, status=403)
        #self.perform_delete(trip)
        #return Response({"success": "Trip deleted successfully."})

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import TripDetails
from .serializers import TripDetailsSerializer

class TripDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = TripDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show trips that belong to the authenticated user
        return TripDetails.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print(f"Error saving trip: {e}")
            raise

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Raises detailed validation errors
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

    def delete_trip(self, request, *args, **kwargs):
        trip = self.get_object()
        if trip.user != request.user:
            return Response({"error": "You are not allowed to delete this trip."}, status=403)
        trip.delete()
        return Response({"success": "Trip deleted successfully."})
