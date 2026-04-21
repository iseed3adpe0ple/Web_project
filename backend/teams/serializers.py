from rest_framework import serializers
from .models import Team, Event, RSVP
from django.contrib.auth.models import User


class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class TeamSerializer(serializers.ModelSerializer):
    owner = UserShortSerializer(read_only=True)
    members = UserShortSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'owner', 'members', 'invite_code', 'created_at']
        read_only_fields = ['invite_code', 'created_at']


class EventSerializer(serializers.ModelSerializer):
    created_by = UserShortSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'event_type',
                  'start_time', 'end_time', 'team', 'created_by', 'created_at']
        read_only_fields = ['created_at']


class RSVPSerializer(serializers.ModelSerializer):
    user = UserShortSerializer(read_only=True)

    class Meta:
        model = RSVP
        fields = ['id', 'event', 'user', 'status']