import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api';
import { Group, Event } from '../../../models/group';

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

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGroup();
    this.loadEvents();
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
      next: () => {},
      error: () => {}
    });
  }

  getTypeLabel(type: string): string {
    const labels: any = { study: 'Учёба', social: 'Социальное', work: 'Работа' };
    return labels[type] || type;
  }

  getTypeClass(type: string): string {
    return `type-${type}`;
  }
}
