from django.shortcuts import render
from .models import UserAchievement
from UserAchievements.models import Achievement

def user_achievements_view(request):
    user_achievements = UserAchievement.objects.filter(user=request.user)
    context = {
        'user_achievements': user_achievements,
    }
    return render(request, 'userachievements/user_achievements.html', context)