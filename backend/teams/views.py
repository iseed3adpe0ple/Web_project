from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.db import IntegrityError
from .models import Team, Event, RSVP
from .serializers import TeamSerializer, EventSerializer, RSVPSerializer
from accounts.models import Invitation
from accounts.serializers import InvitationSerializer


# CBV — список групп / создать группу
class TeamListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teams = Team.objects.filter(members=request.user) | Team.objects.filter(owner=request.user)
        serializer = TeamSerializer(teams.distinct(), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# CBV — детали группы / изменить / удалить
class TeamDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Team.objects.get(pk=pk)
        except Team.DoesNotExist:
            return None

    def get(self, request, pk):
        team = self.get_object(pk)
        if not team:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TeamSerializer(team)
        return Response(serializer.data)

    def put(self, request, pk):
        team = self.get_object(pk)
        if not team:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        if team.owner != request.user:
            return Response({'error': 'No permission'}, status=status.HTTP_403_FORBIDDEN)
        serializer = TeamSerializer(team, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        team = self.get_object(pk)
        if not team:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        if team.owner != request.user:
            return Response({'error': 'No permission'}, status=status.HTTP_403_FORBIDDEN)
        team.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# FBV — вступить по коду
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_team_by_code(request):
    invite_code = request.data.get('invite_code')
    if not invite_code:
        return Response({'detail': 'Требуется invite_code'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        team = Team.objects.get(invite_code=invite_code)
    except Team.DoesNotExist:
        return Response({'detail': 'Неверный код группы'}, status=status.HTTP_400_BAD_REQUEST)

    if team.owner == request.user or team.members.filter(id=request.user.id).exists():
        return Response(TeamSerializer(team).data)

    team.members.add(request.user)
    return Response(TeamSerializer(team).data)


# CBV — события группы
class EventListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        events = Event.objects.filter(team_id=pk)
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, pk):
        serializer = EventSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(created_by=request.user, team_id=pk)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# CBV — детали события
class EventDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, event_pk):
        try:
            return Event.objects.get(pk=event_pk, team_id=pk)
        except Event.DoesNotExist:
            return None

    def get(self, request, pk, event_pk):
        event = self.get_object(pk, event_pk)
        if not event:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(EventSerializer(event, context={'request': request}).data)

    def put(self, request, pk, event_pk):
        event = self.get_object(pk, event_pk)
        if not event:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        if event.created_by != request.user:
            return Response({'error': 'No permission'}, status=status.HTTP_403_FORBIDDEN)
        serializer = EventSerializer(event, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, event_pk):
        event = self.get_object(pk, event_pk)
        if not event:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        if event.created_by != request.user:
            return Response({'error': 'No permission'}, status=status.HTTP_403_FORBIDDEN)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# FBV — RSVP
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rsvp_event(request, pk, event_pk):
    try:
        event = Event.objects.get(pk=event_pk, team_id=pk)
    except Event.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    rsvp, created = RSVP.objects.get_or_create(event=event, user=request.user)
    rsvp.status = request.data.get('status', 'going')
    rsvp.save()
    return Response(RSVPSerializer(rsvp).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invite_user(request, pk):
    try:
        team = Team.objects.get(pk=pk)
    except Team.DoesNotExist:
        return Response({'detail': 'Группа не найдена'}, status=status.HTTP_404_NOT_FOUND)

    if team.owner != request.user:
        return Response({'detail': 'Только владелец может приглашать'}, status=status.HTTP_403_FORBIDDEN)

    username = (request.data.get('username') or '').strip()
    if not username:
        return Response({'detail': 'Укажите username'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        invited = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)

    if invited == request.user:
        return Response({'detail': 'Нельзя пригласить самого себя'}, status=status.HTTP_400_BAD_REQUEST)

    if team.members.filter(id=invited.id).exists():
        return Response({'detail': 'Пользователь уже участник'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        invitation = Invitation.objects.create(
            team=team, invited_user=invited, invited_by=request.user
        )
    except IntegrityError:
        return Response({'detail': 'Уже приглашён'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(InvitationSerializer(invitation).data, status=status.HTTP_201_CREATED)