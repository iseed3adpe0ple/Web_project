import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { Group } from '../../models/group';

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

  // Форма создания группы
  showCreateForm = false;
  createName = '';
  createDescription = '';
  createLoading = false;
  createError = '';

  // Форма вступления по коду
  showJoinForm = false;
  joinCode = '';
  joinLoading = false;
  joinError = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.loading = true;
    this.api.getGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loading = false;
      },
      error: () => {
        this.error = 'Не удалось загрузить группы';
        this.loading = false;
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
      },
      error: (err) => {
        this.createError = err.error?.name?.[0] || 'Ошибка при создании группы';
        this.createLoading = false;
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
      },
      error: (err) => {
        this.joinError = err.error?.detail || 'Неверный код группы';
        this.joinLoading = false;
      }
    });
  }

  goToGroup(id: number) {
    this.router.navigate(['/groups', id]);
  }
}
