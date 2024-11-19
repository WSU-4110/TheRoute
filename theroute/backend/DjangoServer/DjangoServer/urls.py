from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # For obtaining access and refresh tokens
    TokenRefreshView,      # For refreshing the access token using the refresh token
    TokenVerifyView        # For verifying access tokens
)
from userAPI import views
from userExpenses.views import ExpenseView
from userTrips.views import TripDetailsViewSet  # Import the TripDetails viewset

# Create a router to automatically handle expense routes
router = DefaultRouter()
router.register(r'expenses', ExpenseView, basename='expense')
router.register(r'trips', TripDetailsViewSet, basename='trip')  # Register the trips routes


urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # User registration, login, and logout
    path('api/register/', views.UserRegister.as_view(), name='register'),
    path('api/login/', views.UserLogin.as_view(), name='login'),
    path('api/logout/', views.UserLogout.as_view(), name='logout'),
    path('api/user/', views.UserView.as_view(), name='user'),

    # JWT token management endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Obtain tokens
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh access token
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),  # Verify access token
    
    # User expenses and trips: add, delete, get
    path('api/', include(router.urls)),  # API routes for expenses and trips
]
