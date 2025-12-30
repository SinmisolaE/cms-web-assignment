export interface Article {
  _id: string;
  title: string;
  body: string;
  author: {
    _id: string;
    fullName: string;
    email: string;
  };
  imageUrl?: string;
  isPublished: boolean;
  publishedAt?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleResponse {
  success: boolean;
  articles: Article[];
  count: number;
  page: number;
  totalPages: number;
}