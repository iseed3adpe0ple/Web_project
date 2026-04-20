from django.contrib import admin
from .models import Poll, PollOption

admin.site.register(Poll)
admin.site.register(PollOption)