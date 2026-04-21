from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Team, Event, RSVP
from .serializers import TeamSerializer, EventSerializer, RSVPSerializer


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
def join_team(request, pk):
    invite_code = request.data.get('invite_code')
    try:
        team = Team.objects.get(pk=pk, invite_code=invite_code)
    except Team.DoesNotExist:
        return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
    team.members.add(request.user)
    return Response(TeamSerializer(team).data)


# CBV — события группы
class EventListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        events = Event.objects.filter(team_id=pk)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        serializer = EventSerializer(data=request.data)
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
        return Response(EventSerializer(event).data)

    def put(self, request, pk, event_pk):
        event = self.get_object(pk, event_pk)
        if not event:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        if event.created_by != request.user:
            return Response({'error': 'No permission'}, status=status.HTTP_403_FORBIDDEN)
        serializer = EventSerializer(event, data=request.data, partial=True)
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