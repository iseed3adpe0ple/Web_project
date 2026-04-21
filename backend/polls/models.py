from django.db import models
from django.contrib.auth.models import User
from teams.models import Team


class Poll(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='polls')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_polls')
    deadline = models.DateTimeField()
    is_closed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def check_deadline(self):
        from django.utils import timezone
        if not self.is_closed and timezone.now() >= self.deadline:
            self.is_closed = True
            self.save()

    def get_winner(self):
        return self.options.order_by('-votes_count').first()


class PollOption(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='options')
    datetime = models.DateTimeField()
    votes = models.ManyToManyField(User, related_name='voted_options', blank=True)

    def vote_count(self):
        return self.votes.count()

    def __str__(self):
        return f"{self.poll.title} — {self.datetime}"