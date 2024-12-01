from rest_framework import viewsets, permissions, status  # Import permissions and status
from rest_framework.response import Response  # Import Response
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from .models import TripDetails
from .serializers import TripDetailsSerializer

class TripDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = TripDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]  # Ensure permissions are set

    def get_queryset(self):
        return TripDetails.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except IntegrityError as e:
            if 'unique constraint' in str(e).lower():
                raise ValidationError({"trip_name": "A trip with this name already exists."})
            raise

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

