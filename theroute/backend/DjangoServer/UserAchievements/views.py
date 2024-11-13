# achievements/views.py
from rest_framework import viewsets, permissions
from .models import Achievement
from .serializers import AchievementSerializer

class AchievementView(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        print(f"Authenticated user: {self.request.user}")  # Debug: Check the user
        return Achievement.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
