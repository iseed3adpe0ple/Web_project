from django.contrib import admin
from .models import Team, Event, RSVP

admin.site.register(Team)
admin.site.register(Event)
admin.site.register(RSVP)