from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Poll, PollOption
from .serializers import PollSerializer, PollOptionSerializer


# CBV — список опросов / создать
class PollListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        polls = Poll.objects.filter(team_id=pk)
        # проверяем дедлайн для каждого опроса
        for poll in polls:
            poll.check_deadline()
        serializer = PollSerializer(polls, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, pk):
        serializer = PollSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user, team_id=pk)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# CBV — детали опроса / изменить / удалить
class PollDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, poll_pk):
        try:
            return Poll.objects.get(pk=poll_pk, team_id=pk)
        except Poll.DoesNotExist:
            return None

    def get(self, request, pk, poll_pk):
        poll = self.get_object(pk, poll_pk)
        if not poll:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        poll.check_deadline()
        serializer = PollSerializer(poll, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, poll_pk):
        poll = self.get_object(pk, poll_pk)
        if not poll:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        if poll.created_by != request.user:
            return Response({'error': 'No permission'}, status=status.HTTP_403_FORBIDDEN)
        serializer = PollSerializer(poll, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, poll_pk):
        poll = self.get_object(pk, poll_pk)
        if not poll:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        if poll.created_by != request.user:
            return Response({'error': 'No permission'}, status=status.HTTP_403_FORBIDDEN)
        poll.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# FBV — проголосовать
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote(request, pk, poll_pk):
    try:
        poll = Poll.objects.get(pk=poll_pk, team_id=pk)
    except Poll.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if poll.is_closed:
        return Response({'error': 'Poll is closed'}, status=status.HTTP_400_BAD_REQUEST)

    poll.check_deadline()
    if poll.is_closed:
        return Response({'error': 'Deadline passed'}, status=status.HTTP_400_BAD_REQUEST)

    option_id = request.data.get('option_id')
    action = request.data.get('action', 'vote')  # 'vote' или 'unvote'

    try:
        option = PollOption.objects.get(pk=option_id, poll=poll)
    except PollOption.DoesNotExist:
        return Response({'error': 'Option not found'}, status=status.HTTP_404_NOT_FOUND)

    if action == 'vote':
        option.votes.add(request.user)
    elif action == 'unvote':
        option.votes.remove(request.user)

    return Response(PollOptionSerializer(option, context={'request': request}).data)


# FBV — результаты
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def poll_results(request, pk, poll_pk):
    try:
        poll = Poll.objects.get(pk=poll_pk, team_id=pk)
    except Poll.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    poll.check_deadline()

    options = poll.options.all()
    winner = max(options, key=lambda o: o.votes.count(), default=None)

    return Response({
        'poll': PollSerializer(poll, context={'request': request}).data,
        'winner': PollOptionSerializer(winner, context={'request': request}).data if winner else None,
        'is_closed': poll.is_closed,
    })