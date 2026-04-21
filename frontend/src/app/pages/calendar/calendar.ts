import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { Group, Event } from '../../models/group';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent implements OnInit {
  groups: Group[] = [];
  allEvents: Event[] = [];
  loading = true;
  error = '';

  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();

  monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь',
    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  dayNames = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

  calendarDays: { date: Date | null, events: Event[] }[] = [];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAllEvents();
    }
  }

  loadAllEvents() {
    this.api.getGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        if (groups.length === 0) {
          this.loading = false;
          this.buildCalendar();
          return;
        }
        let loaded = 0;
        groups.forEach(group => {
          this.api.getGroupEvents(group.id).subscribe({
            next: (events) => {
              this.allEvents = [...this.allEvents, ...events];
              loaded++;
              if (loaded === groups.length) {
                this.loading = false;
                this.buildCalendar();
                this.cdr.markForCheck();
              }
            },
            error: () => {
              loaded++;
              if (loaded === groups.length) {
                this.loading = false;
                this.buildCalendar();
                this.cdr.markForCheck();
              }
            }
          });
        });
      },
      error: () => {
        this.error = 'Не удалось загрузить события';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  buildCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);


    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    this.calendarDays = [];


    for (let i = 0; i < startDow; i++) {
      this.calendarDays.push({ date: null, events: [] });
    }


    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(this.currentYear, this.currentMonth, d);
      const events = this.allEvents.filter(e => {
        const eventDate = new Date(e.start_time);
        return eventDate.getDate() === d &&
          eventDate.getMonth() === this.currentMonth &&
          eventDate.getFullYear() === this.currentYear;
      });
      this.calendarDays.push({ date, events });
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.buildCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.buildCalendar();
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  getTypeClass(type: string): string {
    return `type-${type}`;
  }
}
