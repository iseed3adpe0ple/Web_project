from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('logout/', views.logout, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('invitations/', views.invitation_list, name='invitation_list'),
    path('invitations/<int:pk>/accept/', views.invitation_respond, name='invitation_respond'),
    path('invitations/<int:pk>/decline/', views.invitation_respond, name='invitation_decline'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
]