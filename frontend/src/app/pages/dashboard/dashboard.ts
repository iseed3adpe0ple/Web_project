import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { Group, Invitation } from '../../models/group';
import { removeStorageItem } from '../../utils/storage';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  username = '';
  groups: Group[] = [];
  invitations: Invitation[] = [];
  loadingGroups = true;
  loadingInvitations = true;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadProfile();
    this.loadGroups();
    this.loadInvitations();
  }

  loadProfile() {
    this.api.getProfile().subscribe({
      next: (profile) => this.username = profile.username,
      error: () => {}
    });
  }

  loadGroups() {
    this.api.getGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loadingGroups = false;
      },
      error: () => {
        this.error = 'Не удалось загрузить группы';
        this.loadingGroups = false;
      }
    });
  }

  loadInvitations() {
    this.api.getInvitations().subscribe({
      next: (inv) => {
        this.invitations = inv.filter(i => i.status === 'pending');
        this.loadingInvitations = false;
      },
      error: () => {
        this.loadingInvitations = false;
      }
    });
  }

  goToGroups() {
    this.router.navigate(['/groups']);
  }

  logout() {
    this.api.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {

        removeStorageItem('access');
        removeStorageItem('refresh');
        this.router.navigate(['/login']);
      }
    });
  }
}
