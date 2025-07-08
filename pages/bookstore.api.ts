import { APIRequestContext } from '@playwright/test';

export class BookStoreAPI {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Get list of all books
   */
  async getAllBooks() {
    return await this.request.get('/BookStore/v1/Books');
  }

  /**
   * Get book by ISBN
   * @param isbn - ISBN of the book
   */
  async getBook(isbn: string) {
    return await this.request.get(`/BookStore/v1/Book?ISBN=${isbn}`);
  }

  /**
   * Create user account
   * @param payload - User details
   */
  async createUser(payload: {
    userName: string;
    password: string;
  }) {
    return await this.request.post('/Account/v1/User', {
      data: payload
    });
  }

  /**
   * Generate token
   * @param payload - User credentials
   */
  async generateToken(payload: {
    userName: string;
    password: string;
  }) {
    return await this.request.post('/Account/v1/GenerateToken', {
      data: payload
    });
  }

  /**
   * Add books to user collection
   * @param userId - User ID
   * @param isbn - ISBN of the book
   * @param token - User authentication token
   */
  async addBook(userId: string, isbn: string, token: string) {
    return await this.request.post('/BookStore/v1/Books', {
      data: {
        userId,
        collectionOfIsbns: [{ isbn }]
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  /**
   * Delete book from user collection
   * @param userId - User ID
   * @param isbn - ISBN of the book
   * @param token - User authentication token
   */
  async deleteBook(userId: string, isbn: string, token: string) {
    return await this.request.delete('/BookStore/v1/Book', {
      data: {
        isbn,
        userId
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  /**
   * Update book in user collection
   * @param userId - User ID
   * @param oldIsbn - Current ISBN of the book
   * @param newIsbn - New ISBN to replace with
   * @param token - User authentication token
   */
  async updateBook(userId: string, oldIsbn: string, newIsbn: string, token: string) {
    return await this.request.put(`/BookStore/v1/Books/${oldIsbn}`, {
      data: {
        userId,
        isbn: newIsbn
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
