from django.urls import path
from . import views

urlpatterns = [
    path('groups/', views.TeamListView.as_view(), name='team_list'),
    path('groups/<int:pk>/', views.TeamDetailView.as_view(), name='team_detail'),
    path('groups/join/', views.join_team_by_code, name='join_team'),
    path('groups/<int:pk>/invite/', views.invite_user, name='invite_user'),
    path('groups/<int:pk>/members/', views.TeamDetailView.as_view(), name='team_members'),
    path('groups/<int:pk>/events/', views.EventListView.as_view(), name='event_list'),
    path('groups/<int:pk>/events/<int:event_pk>/', views.EventDetailView.as_view(), name='event_detail'),
    path('groups/<int:pk>/events/<int:event_pk>/rsvp/', views.rsvp_event, name='rsvp_event'),
]