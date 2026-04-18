import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  onRegister() {
    this.error = '';
    this.loading = true;

    this.api.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        const errors = err.error;
        this.error = errors?.username?.[0] || errors?.email?.[0] || errors?.password?.[0] || 'Ошибка регистрации';
        this.loading = false;
      }
    });
  }
}
