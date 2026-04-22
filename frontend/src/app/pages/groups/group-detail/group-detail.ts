import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api';
import { Group, Event } from '../../../models/group';
import { Poll, PollOption } from '../../../models/poll';
import { User } from '../../../models/user';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css'
})
export class GroupDetailComponent implements OnInit {
  groupId!: number;
  group: Group | null = null;
  events: Event[] = [];
  loading = true;
  error = '';

  showEventForm = false;
  eventTitle = '';
  eventStartTime = '';
  eventEndTime = '';
  eventLocation = '';
  eventDescription = '';
  eventType: 'study' | 'social' | 'work' = 'social';
  eventLoading = false;
  eventError = '';

  currentUser: User | null = null;

  // Invite
  showInviteForm = false;
  inviteUsername = '';
  inviteLoading = false;
  inviteError = '';
  inviteSuccess = false;

  // Polls
  polls: Poll[] = [];
  showPollForm = false;
  pollTitle = '';
  pollDescription = '';
  pollDeadline = '';
  pollOptions: string[] = ['', ''];
  pollLoading = false;
  pollError = '';

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCurrentUser();
    this.loadGroup();
    this.loadEvents();
    this.loadPolls();
  }

  loadCurrentUser() {
    this.api.getProfile().subscribe({
      next: (user) => this.currentUser = user,
      error: () => {}
    });
  }

  loadPolls() {
    this.api.getPolls(this.groupId).subscribe({
      next: (polls) => this.polls = polls,
      error: () => {}
    });
  }

  isOwner(): boolean {
    return !!this.group && !!this.currentUser && this.group.owner?.id === this.currentUser.id;
  }

  loadGroup() {
    this.api.getGroup(this.groupId).subscribe({
      next: (group) => {
        this.group = group;
        this.loading = false;
      },
      error: () => {
        this.error = 'Не удалось загрузить группу';
        this.loading = false;
      }
    });
  }

  loadEvents() {
    this.api.getGroupEvents(this.groupId).subscribe({
      next: (events) => this.events = events,
      error: () => {}
    });
  }

  createEvent() {
    if (!this.eventTitle.trim() || !this.eventStartTime || !this.eventEndTime) {
      this.eventError = 'Заполните название, начало и конец события';
      return;
    }
    this.eventLoading = true;
    this.eventError = '';

    this.api.createEvent(this.groupId, {
      title: this.eventTitle,
      description: this.eventDescription,
      location: this.eventLocation,
      event_type: this.eventType,
      start_time: this.eventStartTime,
      end_time: this.eventEndTime,
    }).subscribe({
      next: (event) => {
        this.events.push(event);
        this.showEventForm = false;
        this.eventTitle = '';
        this.eventStartTime = '';
        this.eventEndTime = '';
        this.eventLocation = '';
        this.eventDescription = '';
        this.eventLoading = false;
      },
      error: (err) => {
        this.eventError = err.error?.title?.[0] || 'Ошибка при создании события';
        this.eventLoading = false;
      }
    });
  }

  rsvp(eventId: number, status: 'going' | 'maybe' | 'not_going') {
    this.api.rsvpEvent(this.groupId, eventId, status).subscribe({
      next: () => this.loadEvents(),
      error: () => {}
    });
  }

  rsvpCount(event: Event, status: 'going' | 'maybe' | 'not_going'): number {
    return (event.rsvps || []).filter(r => r.status === status).length;
  }

  rsvpUsers(event: Event, status: 'going' | 'maybe' | 'not_going'): string {
    return (event.rsvps || [])
      .filter(r => r.status === status)
      .map(r => r.user.username)
      .join(', ');
  }

  getTypeLabel(type: string): string {
    const labels: any = { study: 'Учёба', social: 'Социальное', work: 'Работа' };
    return labels[type] || type;
  }

  getTypeClass(type: string): string {
    return `type-${type}`;
  }

  sendInvite() {
    if (!this.inviteUsername.trim()) {
      this.inviteError = 'Введите username';
      return;
    }
    this.inviteLoading = true;
    this.inviteError = '';
    this.inviteSuccess = false;

    this.api.inviteUser(this.groupId, this.inviteUsername.trim()).subscribe({
      next: () => {
        this.inviteSuccess = true;
        this.inviteUsername = '';
        this.inviteLoading = false;
        setTimeout(() => this.inviteSuccess = false, 3000);
      },
      error: (err) => {
        this.inviteError = err.error?.detail || 'Ошибка при отправке приглашения';
        this.inviteLoading = false;
      }
    });
  }

  addPollOption() {
    this.pollOptions.push('');
  }

  removePollOption(index: number) {
    if (this.pollOptions.length > 2) {
      this.pollOptions.splice(index, 1);
    }
  }

  createPoll() {
    const filled = this.pollOptions.filter(o => o.trim());
    if (!this.pollTitle.trim()) {
      this.pollError = 'Введите название опроса';
      return;
    }
    if (!this.pollDeadline) {
      this.pollError = 'Укажите дедлайн';
      return;
    }
    if (filled.length < 2) {
      this.pollError = 'Нужно минимум 2 варианта';
      return;
    }
    this.pollLoading = true;
    this.pollError = '';

    this.api.createPoll(this.groupId, {
      title: this.pollTitle,
      description: this.pollDescription,
      deadline: this.pollDeadline,
      options: filled.map(datetime => ({ datetime }))
    }).subscribe({
      next: (poll) => {
        this.polls.unshift(poll);
        this.resetPollForm();
        this.pollLoading = false;
      },
      error: (err) => {
        this.pollError = err.error?.title?.[0] || err.error?.deadline?.[0] || 'Ошибка при создании опроса';
        this.pollLoading = false;
      }
    });
  }

  resetPollForm() {
    this.showPollForm = false;
    this.pollTitle = '';
    this.pollDescription = '';
    this.pollDeadline = '';
    this.pollOptions = ['', ''];
  }

  voteOption(poll: Poll, option: PollOption) {
    if (poll.is_closed) return;
    const action = option.has_voted ? 'unvote' : 'vote';
    this.api.vote(this.groupId, poll.id, option.id, action).subscribe({
      next: (updated) => {
        const p = this.polls.find(x => x.id === poll.id);
        if (p) {
          const idx = p.options.findIndex(o => o.id === option.id);
          if (idx >= 0) p.options[idx] = updated;
        }
      },
      error: () => {}
    });
  }

  deletePoll(pollId: number) {
    if (!confirm('Удалить опрос?')) return;
    this.api.deletePoll(this.groupId, pollId).subscribe({
      next: () => this.polls = this.polls.filter(p => p.id !== pollId),
      error: () => {}
    });
  }

  getWinner(poll: Poll): PollOption | null {
    if (!poll.is_closed || poll.options.length === 0) return null;
    return poll.options.reduce((max, o) => o.vote_count > max.vote_count ? o : max, poll.options[0]);
  }

  canDeletePoll(poll: Poll): boolean {
    return !!this.currentUser && poll.created_by === this.currentUser.username;
  }
}
