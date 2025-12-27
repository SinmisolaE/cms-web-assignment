import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div class="card shadow" style="width: 100%; max-width: 500px;">
        <div class="card-body p-4">
          <h2 class="text-center mb-4">📝 Register</h2>
          
          <form>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" placeholder="John Doe">
              </div>
              
              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" placeholder="john@example.com">
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" placeholder="Create password">
            </div>
            
            <div class="mb-3">
              <label class="form-label">Confirm Password</label>
              <input type="password" class="form-control" placeholder="Confirm password">
            </div>
            
            <div class="mb-3">
              <label class="form-label">Role</label>
              <select class="form-select">
                <option value="">Select a role</option>
                <option value="Viewer">Viewer</option>
                <option value="Contributor">Contributor</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            
            <button type="submit" class="btn btn-success w-100 mb-3">
              Create Account
            </button>
            
            <p class="text-center">
              Already have an account? 
              <a routerLink="/login" class="text-decoration-none">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {}