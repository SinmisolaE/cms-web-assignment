export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  requiredPermissions: string[];
  children?: MenuItem[];
}

export interface UserStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalUsers: number;
}