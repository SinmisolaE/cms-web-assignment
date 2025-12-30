import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './article-list.html',
  styleUrls: ['./article-list.css']
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  isLoading = true;
  errorMessage = '';
  
  // Current user info
  currentUserRole = '';
  canCreate = false;
  canEdit = false;
  canDelete = false;
  canPublish = false;

  constructor(
    private articleService: ArticleService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
    this.loadArticles();
  }

  checkPermissions(): void {
    this.canCreate = this.authService.hasPermission('create_article');
    this.canEdit = this.authService.hasPermission('edit_article');
    this.canDelete = this.authService.hasPermission('delete_article');
    this.canPublish = this.authService.hasPermission('publish_article');
    
    const user = this.authService.getCurrentUser();
    this.currentUserRole = user?.role || '';
  }

  loadArticles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Check route data to determine which articles to load
    const mode = this.route.snapshot.data['mode'];
    
    if (mode === 'published') {
      this.loadPublishedArticles();
    } else {
      this.loadAllArticles();
    }
  }

  loadAllArticles(): void {
    this.articleService.getAllArticles().subscribe({
      next: (response) => {
        this.articles = response.articles;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load articles';
        this.isLoading = false;
        console.error('Error loading articles:', error);
      }
    });
  }

  loadPublishedArticles(): void {
    this.articleService.getPublishedArticles().subscribe({
      next: (response) => {
        this.articles = response.articles;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load articles';
        this.isLoading = false;
        console.error('Error loading articles:', error);
      }
    });
  }

  editArticle(articleId: string): void {
    this.router.navigate(['/dashboard/articles', articleId, 'edit']);
  }

  viewArticle(articleId: string): void {
    this.router.navigate(['/dashboard/articles', articleId]);
  }

  deleteArticle(articleId: string, articleTitle: string): void {
    if (confirm(`Are you sure you want to delete "${articleTitle}"?`)) {
      this.articleService.deleteArticle(articleId).subscribe({
        next: () => {
          // Remove article from list
          this.articles = this.articles.filter(article => article._id !== articleId);
        },
        error: (error) => {
          alert('Failed to delete article');
          console.error('Delete error:', error);
        }
      });
    }
  }

  togglePublish(article: Article): void {
  if (article.isPublished) {
    // Unpublish
    if (confirm(`Unpublish "${article.title}"?`)) {
      this.articleService.unpublishArticle(article._id).subscribe({
        next: (updatedArticle) => {
          article.isPublished = updatedArticle.isPublished;
          article.publishedAt = updatedArticle.publishedAt;
        },
        error: (error) => {
          alert('Failed to unpublish article');
          console.error('Unpublish error:', error);
        }
      });
    }
  } else {
    // Publish
    if (confirm(`Publish "${article.title}"?`)) {
      this.articleService.publishArticle(article._id).subscribe({
        next: (updatedArticle) => {
          article.isPublished = updatedArticle.isPublished;
          article.publishedAt = updatedArticle.publishedAt;
        },
        error: (error) => {
          alert('Failed to publish article');
          console.error('Publish error:', error);
        }
      });
    }
  }
}

  // Check if user can edit this article (author or has edit permission)
  canUserEditArticle(article: Article): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    
    // If user is author
    if (article.author?._id === user.id) return true;
    
    // If user has edit_article permission
    return this.canEdit;
  }

  // Check if user can delete this article
  canUserDeleteArticle(article: Article): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    
    // Only Manager/SuperAdmin can delete
    return this.canDelete;
  }

  // Format date
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}