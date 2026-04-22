import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { getStorageItem } from '../../utils/storage';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    if (getStorageItem('access')) {
      this.router.navigate(['/dashboard']);
    }
  }

  onRegister() {
    this.error = '';
    this.loading = true;

    this.api.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        const errors = err.error;
        this.error = errors?.username?.[0] || errors?.email?.[0] || errors?.password?.[0] || 'Ошибка регистрации';
        this.loading = false;
      }
    });
  }
}
