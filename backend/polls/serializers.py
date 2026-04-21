from rest_framework import serializers
from .models import Poll, PollOption
from django.contrib.auth.models import User


class PollOptionSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()
    has_voted = serializers.SerializerMethodField()

    class Meta:
        model = PollOption
        fields = ['id', 'poll', 'datetime', 'vote_count', 'has_voted']

    def get_vote_count(self, obj):
        return obj.votes.count()

    def get_has_voted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.votes.filter(id=request.user.id).exists()
        return False


class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True, read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Poll
        fields = ['id', 'title', 'description', 'team', 'created_by',
                  'deadline', 'is_closed', 'options', 'created_at']
        read_only_fields = ['is_closed', 'created_at']