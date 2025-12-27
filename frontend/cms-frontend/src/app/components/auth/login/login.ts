import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { LoginCredentials } from '../../../models/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Form data
  email: string = '';
  password: string = '';

  // UI state
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // Handle form submission
  onSubmit(): void {
    console.log('Form submitted!');  // Test if this logs
    // Reset error
    this.errorMessage = '';

    // Validate form
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      console.log(this.errorMessage);
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password
    };

    // Show loading
    this.isLoading = true;

    // Call login service
    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success && response.tokens) {
          // Save tokens to localStorage
          localStorage.setItem('accessToken', response.tokens.accessToken);
          localStorage.setItem('refreshToken', response.tokens.refreshToken);
          
          // Save user data
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          // Navigate to dashboard (we'll create this next)
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'An error occurred. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}