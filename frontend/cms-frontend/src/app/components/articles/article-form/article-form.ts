import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './article-form.html',
  styleUrls: ['./article-form.css']
})
export class ArticleFormComponent implements OnInit {
  // Form data
  title = '';
  content = '';
  tags = '';
  imageFile: File | null = null;
  imagePreview: string | null = null;
  isPublished = false;

  // Component state
  isEditMode = false;
  articleId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Permissions
  canPublish = false;
  canEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
    this.checkRoute();
  }

  checkPermissions(): void {
    this.canPublish = this.authService.hasPermission('publish_article');
    this.canEdit = this.authService.hasPermission('edit_article');
  }

  checkRoute(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode = true;
      this.articleId = id;
      this.loadArticle(id);
    }
  }

  loadArticle(id: string): void {
    this.isLoading = true;
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.title = article.title;
        this.content = article.body;
        this.isPublished = article.isPublished;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load article';
        this.isLoading = false;
        console.error('Error loading article:', error);
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  removeImage(): void {
    this.imageFile = null;
    this.imagePreview = null;
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  validateForm(): boolean {
    if (!this.title.trim()) {
      this.errorMessage = 'Title is required';
      return false;
    }

    if (!this.content.trim()) {
      this.errorMessage = 'Content is required';
      return false;
    }

    if (this.title.length > 200) {
      this.errorMessage = 'Title must be less than 200 characters';
      return false;
    }

    return true;
  }

  prepareFormData(): any {
    const data: any = {
      title: this.title,
      body: this.content
    };
    
    if (this.tags.trim()) {
      const tagArray = this.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      data.tags = tagArray;
    }

    if (this.canPublish) {
      data.isPublished = this.isPublished;
    }

    return data;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    const formData = this.prepareFormData();

    if (this.isEditMode && this.articleId) {
      this.updateArticle(formData);
    } else {
      this.createArticle(formData);
    }
  }

  createArticle(formData: FormData): void {
    this.articleService.createArticle(formData).subscribe({
      next: (article) => {
        this.isSubmitting = false;
        this.successMessage = 'Article created successfully!';
        
        setTimeout(() => {
          this.router.navigate(['/dashboard/articles', article._id]);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.error || 'Failed to create article';
        console.error('Create error:', error);
      }
    });
  }

  updateArticle(formData: FormData): void {
    if (!this.articleId) return;

    this.articleService.updateArticle(this.articleId, formData).subscribe({
      next: (article) => {
        this.isSubmitting = false;
        this.successMessage = 'Article updated successfully!';
        
        setTimeout(() => {
          this.router.navigate(['/dashboard/articles', article._id]);
        }, 1500);
      },
      error: (error) => {
        console.log(error.error);
        this.isSubmitting = false;
        this.errorMessage = error.error?.error || 'Failed to update article';
        console.error('Update error:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/articles']);
  }

  // Helper method for character count
  getCharacterCount(): number {
    return this.content.length;
  }

  // Helper method for word count
  getWordCount(): number {
    return this.content.trim() ? this.content.trim().split(/\s+/).length : 0;
  }
}