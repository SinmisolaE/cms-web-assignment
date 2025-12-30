import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Article, ArticleResponse } from '../models/article.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) {}

  // Get all articles (requires view_all_articles permission)
  getAllArticles(): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.apiUrl}/all`);
  }

  // Get only published articles (requires view_published_only permission)
  getPublishedArticles(): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.apiUrl}/articles`);
  }

  // Get article by ID
  getArticleById(id: string): Observable<Article> {
    return this.http.get<{ success: boolean; article: Article }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.article)
      );
  }

  // Create article (requires create_article permission)
  createArticle(articleData: any): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/create`, articleData);
  }

  // Update article (requires edit_article permission)
  updateArticle(id: string, articleData: any): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, articleData);
  }

  // Delete article (requires delete_article permission)
  deleteArticle(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  // Add this method to ArticleService class
  publishArticle(id: string): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/status`, {
        id: id,
        publish: true
    });
  }

  unpublishArticle(id: string): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/status`, {
        id: id,
        publish: false
    });
  }
}