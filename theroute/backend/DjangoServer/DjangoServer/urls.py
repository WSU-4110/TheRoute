from userAPI import views as user_views
from userExpenses.views import ExpenseView
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
<<<<<<< HEAD
from userAPI import views
from userExpenses.views import ExpenseView
from userTrips.views import TripDetailsViewSet  # Import the TripDetails viewset
=======
from django.contrib import admin
>>>>>>> 143f6347e11bb5e25725f00da21be994d4d01e6e

# Create a router to automatically handle routes for expenses
router = DefaultRouter()
router.register(r'expenses', ExpenseView, basename='expense')
router.register(r'trips', TripDetailsViewSet, basename='trip')  # Register the trips routes


urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # User registration, login, and logout
    path('api/register/', user_views.UserRegister.as_view(), name='register'),
    path('api/login/', user_views.UserLogin.as_view(), name='login'),
    path('api/logout/', user_views.UserLogout.as_view(), name='logout'),
    path('api/user/', user_views.UserView.as_view(), name='user'),

    # JWT token management endpoints
<<<<<<< HEAD
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Obtain tokens
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh access token
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),  # Verify access token
    
    # User expenses and trips: add, delete, get
    path('api/', include(router.urls)),  # API routes for expenses and trips
=======
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # User expenses
    path('api/', include(router.urls)),

    # Achievement-related routes
    path('api/achievements/list/', user_views.list_user_achievements, name='list_user_achievements'),
    path('api/achievements/details/<int:achievement_id>/', user_views.achievement_details, name='achievement_details'),
    path('api/achievements/award/<str:achievement_key>/', user_views.award_achievement_view, name='award_achievement'),
    path('api/achievements/all/', user_views.list_all_achievements, name='list_all_achievements'),  # Added endpoint
>>>>>>> 143f6347e11bb5e25725f00da21be994d4d01e6e
]
