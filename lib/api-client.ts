const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Posts API
  async getAllPosts() {
    return this.request<{ posts: any[] }>('/posts');
  }

  async getPost(id: string) {
    return this.request<{ post: any }>(`/posts/${id}`);
  }

  async createPost(postData: {
    author: { address: string; name?: string; avatarUrl?: string };
    text?: string;
    media?: { type: string; url: string }[];
  }) {
    return this.request<{ post: any }>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async votePost(postId: string, userAddress: string, voteType: 'up' | 'down') {
    return this.request<{ post: any }>(`/posts/${postId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ userAddress, voteType }),
    });
  }

  async getPostsByUser(address: string) {
    return this.request<{ posts: any[] }>(`/posts/user/${address}`);
  }

  // Comments API
  async getComments(postId: string) {
    return this.request<{ comments: any[] }>(`/posts/${postId}/comments`);
  }

  async createComment(postId: string, commentData: {
    author: { address: string; name?: string; avatarUrl?: string };
    text: string;
  }) {
    return this.request<{ comment: any }>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }
}

export const apiClient = new ApiClient();
