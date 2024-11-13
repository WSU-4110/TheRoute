from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from userAPI import views as user_views
from userExpenses.views import ExpenseView
from UserAchievements.views import AchievementView  # Import Achievement view

# Create a router to automatically handle routes for expenses and achievements
router = DefaultRouter()
router.register(r'expenses', ExpenseView, basename='expense')
router.register(r'achievements', AchievementView, basename='achievement')  # Add achievement routes

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # User registration, login, and logout
    path('api/register/', user_views.UserRegister.as_view(), name='register'),
    path('api/login/', user_views.UserLogin.as_view(), name='login'),
    path('api/logout/', user_views.UserLogout.as_view(), name='logout'),
    path('api/user/', user_views.UserView.as_view(), name='user'),

    # JWT token management endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # User expenses and achievements: add, delete, get
    path('api/', include(router.urls)),  # API routes for expenses and achievements
]
