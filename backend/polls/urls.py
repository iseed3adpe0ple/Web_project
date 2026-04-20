from django.urls import path
from . import views

urlpatterns = [
    path('groups/<int:pk>/polls/', views.PollListView.as_view(), name='poll_list'),
    path('groups/<int:pk>/polls/<int:poll_pk>/', views.PollDetailView.as_view(), name='poll_detail'),
    path('groups/<int:pk>/polls/<int:poll_pk>/vote/', views.vote, name='vote'),
    path('groups/<int:pk>/polls/<int:poll_pk>/results/', views.poll_results, name='poll_results'),
]