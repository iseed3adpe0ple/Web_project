from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('invitations/', views.invitation_list, name='invitation_list'),
    path('invitations/<int:pk>/accept/', views.invitation_accept, name='invitation_accept'),
    path('invitations/<int:pk>/decline/', views.invitation_decline, name='invitation_decline'),
]
