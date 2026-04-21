import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { Group } from '../../models/group';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './groups.html',
  styleUrl: './groups.css'
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];
  loading = true;
  error = '';

  showCreateForm = false;
  createName = '';
  createDescription = '';
  createLoading = false;
  createError = '';

  showJoinForm = false;
  joinCode = '';
  joinLoading = false;
  joinError = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGroups();
    }
  }

  loadGroups() {
    this.loading = true;
    this.api.getGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Не удалось загрузить группы';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  createGroup() {
    if (!this.createName.trim()) {
      this.createError = 'Введите название группы';
      return;
    }
    this.createLoading = true;
    this.createError = '';

    this.api.createGroup({ name: this.createName, description: this.createDescription }).subscribe({
      next: (group) => {
        this.groups.push(group);
        this.showCreateForm = false;
        this.createName = '';
        this.createDescription = '';
        this.createLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.createError = err.error?.name?.[0] || 'Ошибка при создании группы';
        this.createLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  joinGroup() {
    if (!this.joinCode.trim()) {
      this.joinError = 'Введите код группы';
      return;
    }
    this.joinLoading = true;
    this.joinError = '';

    this.api.joinGroup(this.joinCode).subscribe({
      next: (group) => {
        this.groups.push(group);
        this.showJoinForm = false;
        this.joinCode = '';
        this.joinLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.joinError = err.error?.detail || 'Неверный код группы';
        this.joinLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  goToGroup(id: number) {
    this.router.navigate(['/groups', id]);
  }
}
