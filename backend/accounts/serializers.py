from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Invitation


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class InvitationSerializer(serializers.ModelSerializer):
    invited_user = UserSerializer(read_only=True)
    invited_by = UserSerializer(read_only=True)
    group = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = ['id', 'group', 'invited_user', 'invited_by', 'status', 'created_at']
        read_only_fields = ['created_at']

    def get_group(self, obj):
        from teams.serializers import TeamSerializer
        return TeamSerializer(obj.team).data