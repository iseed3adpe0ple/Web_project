import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  loading = true;
  error = '';

  editMode = false;
  editUsername = '';
  editEmail = '';
  editLoading = false;
  editError = '';
  editSuccess = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.api.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.editUsername = profile.username;
        this.editEmail = profile.email;
        this.loading = false;
      },
      error: () => {
        this.error = 'Не удалось загрузить профиль';
        this.loading = false;
      }
    });
  }


  saveProfile() {
    this.editLoading = true;
    this.editError = '';
    this.editSuccess = false;

    this.api.updateProfile({ username: this.editUsername, email: this.editEmail }).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.editMode = false;
        this.editLoading = false;
        this.editSuccess = true;
        setTimeout(() => this.editSuccess = false, 3000);
      },
      error: (err) => {
        this.editError = err.error?.username?.[0] || err.error?.email?.[0] || 'Ошибка при сохранении';
        this.editLoading = false;
      }
    });
  }
}
