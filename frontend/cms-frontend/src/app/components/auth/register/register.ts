import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { RegisterData, RegisterFormData, RoleOption } from '../../../models/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
  // Form data
  userData: RegisterFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleName: 'Viewer'
  };

  // Available roles for dropdown
  roles: RoleOption[] = [
    { name: 'Viewer', description: 'Can only view published articles' },
    { name: 'Contributor', description: 'Can create and edit articles' },
    { name: 'Manager', description: 'Can manage and publish articles' }
  ];

  // UI state
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Password validation
  passwordMatch = true;
  passwordStrength = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // We'll load roles from API later
  }

  // Check if passwords match
  checkPasswordMatch(): void {
    this.passwordMatch = this.userData.password === this.userData.confirmPassword;
  }

  // Check password strength
  checkPasswordStrength(): void {
    const password = this.userData.password;
    if (password.length === 0) {
      this.passwordStrength = '';
    } else if (password.length < 6) {
      this.passwordStrength = 'weak';
    } else if (password.length < 8) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  // Handle form submission
  onSubmit(): void {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    // Show loading
    this.isLoading = true;

    // Prepare data for API (remove confirmPassword)
    const apiData = {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      password: this.userData.password,
      roleName: this.userData.roleName
    };

    // Call register service
    this.authService.register(apiData).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.successMessage = 'Registration successful! Redirecting to login...';
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'An error occurred during registration';
        console.error('Registration error:', error);
      }
    });
  }

  // Form validation
  private validateForm(): boolean {
    if (!this.userData.firstName.trim()) {
      this.errorMessage = 'First name is required';
      return false;
    }
    if (!this.userData.lastName.trim()) {
      this.errorMessage = 'Last name is required';
      return false;
    }

    if (!this.userData.email.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (!this.userData.password) {
      this.errorMessage = 'Password is required';
      return false;
    }

    if (this.userData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return false;
    }

    if (!this.passwordMatch) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    return true;
  }

  // Navigate to login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}