from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.auth_urls')),
    path('api/', include('accounts.urls')),
    path('api/', include('teams.urls')),
    path('api/', include('polls.urls')),
]
