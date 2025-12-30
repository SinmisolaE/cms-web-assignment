import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './article-detail.html',
  styleUrls: ['./article-detail.css']
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  isLoading = true;
  errorMessage = '';
  
  // Permissions
  canEdit = false;
  canDelete = false;
  canPublish = false;
  isAuthor = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
    this.loadArticle();
  }

  checkPermissions(): void {
    this.canEdit = this.authService.hasPermission('edit_article');
    this.canDelete = this.authService.hasPermission('delete_article');
    this.canPublish = this.authService.hasPermission('publish_article');
  }

  formatContent(content: string): string {
    // Sanitize and format content for safe HTML display
    if (!content) return '';
    
    // Replace newlines with <br> tags
    const formatted = content.replace(/\n/g, '<br>');
    
    // Basic XSS protection (you can add more if needed)
    const safeContent = formatted
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
      
    return safeContent.replace(/&lt;br&gt;/g, '<br>'); // Keep <br> tags
  }

  loadArticle(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Article not found';
      this.isLoading = false;
      return;
    }

    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.article = article;
        this.checkIfAuthor();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load article';
        this.isLoading = false;
        console.error('Error loading article:', error);
      }
    });
  }

  checkIfAuthor(): void {
    if (!this.article) return;
    
    const user = this.authService.getCurrentUser();
    this.isAuthor = user?.id === this.article?.author?._id;
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  editArticle(): void {
    if (this.article) {
      this.router.navigate(['/dashboard/articles', this.article._id, 'edit']);
    }
  }

  deleteArticle(): void {
    if (!this.article) return;

    if (confirm(`Delete "${this.article.title}"?`)) {
      this.articleService.deleteArticle(this.article._id).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/articles']);
        },
        error: (error) => {
          alert('Failed to delete article');
          console.error('Delete error:', error);
        }
      });
    }
  }

  togglePublish(): void {
  if (!this.article) return;

  if (this.article.isPublished) {
    // Unpublish
    if (confirm(`Unpublish "${this.article.title}"?`)) {
      this.articleService.unpublishArticle(this.article._id).subscribe({
        next: (updatedArticle) => {
          this.article!.isPublished = updatedArticle.isPublished;
          this.article!.publishedAt = updatedArticle.publishedAt;
        },
        error: (error) => {
          alert('Failed to unpublish article');
          console.error('Error:', error);
        }
      });
    }
  } else {
    // Publish
    if (confirm(`Publish "${this.article.title}"?`)) {
      this.articleService.publishArticle(this.article._id).subscribe({
        next: (updatedArticle) => {
          this.article!.isPublished = updatedArticle.isPublished;
          this.article!.publishedAt = updatedArticle.publishedAt;
        },
        error: (error) => {
          alert('Failed to publish article');
          console.error('Error:', error);
        }
      });
    }
  }
}

  goBack(): void {
    this.router.navigate(['/dashboard/articles']);
  }
}