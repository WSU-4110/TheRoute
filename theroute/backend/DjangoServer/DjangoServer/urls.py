from userAPI import views as user_views
from userExpenses.views import ExpenseView
from userTrips.views import TripDetailsViewSet  # Import the TripDetails viewset
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# Create a router to automatically handle routes for expenses and trips
router = DefaultRouter()
router.register(r'expenses', ExpenseView, basename='expense')
router.register(r'trips', TripDetailsViewSet, basename='trip')

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # User registration, login, logout, and user management
    path('api/register/', user_views.UserRegister.as_view(), name='register'),
    path('api/login/', user_views.UserLogin, name='login'),  # Removed .as_view()
    path('api/logout/', user_views.UserLogout.as_view(), name='logout'),
    path('api/user/', user_views.UserView.as_view(), name='user'),

    # JWT token management endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # API routes for expenses and trips
    path('api/', include(router.urls)),

    # User achievements endpoints
    path('api/achievements/list/', user_views.list_user_achievements, name='list_user_achievements'),
    path('api/achievements/details/<int:achievement_id>/', user_views.achievement_details, name='achievement_details'),
    path('api/achievements/award/<str:achievement_key>/', user_views.award_achievement_view, name='award_achievement'),
    path('api/achievements/all/', user_views.list_all_achievements, name='list_all_achievements'),
]
