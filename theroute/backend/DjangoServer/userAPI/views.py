from django.apps import apps
from django.contrib.auth import get_user_model, logout, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, UserAchievementSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from achievements.utils import award_achievement
from .serializers import AchievementSerializer  # Import the serializer for achievements


User = get_user_model()

# Helper function to create JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        validated_data = request.data
        serializer = UserRegisterSerializer(data=validated_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(validated_data)
            if user:
                tokens = get_tokens_for_user(user)
                return Response({
                    'user': serializer.data,
                    'tokens': tokens,
                }, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')

        user = authenticate(request, username=email, password=password)
        if user is None:
            if not User.objects.filter(email=email).exists():
                return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
            return Response({"error": "Incorrect password."}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(user)
        return Response({
            "message": "Login successful",
            "tokens": tokens,
        }, status=status.HTTP_200_OK)

class UserLogout(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        logout(request)
        return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)

class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

# Achievement Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_user_achievements(request):
    UserAchievement = apps.get_model('achievements', 'UserAchievement')
    user_achievements = UserAchievement.objects.filter(user=request.user)
    serializer = UserAchievementSerializer(user_achievements, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_achievements(request):
    """List all general achievements."""
    try:
        Achievement = apps.get_model('achievements', 'Achievement')  # Lazy load the model
        all_achievements = Achievement.objects.all()  # Fetch all achievements
        serializer = AchievementSerializer(all_achievements, many=True)  # Use the correct serializer
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"An unexpected error occurred: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def achievement_details(request, achievement_id):
    UserAchievement = apps.get_model('achievements', 'UserAchievement')
    user_achievement = get_object_or_404(UserAchievement, user=request.user, achievement__id=achievement_id)
    serializer = UserAchievementSerializer(user_achievement)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def award_achievement_view(request, achievement_key):
    award_achievement(request.user, achievement_key)
    return Response({"status": f"Achievement '{achievement_key}' processed successfully."}, status=status.HTTP_200_OK)
