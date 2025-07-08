import { test, expect, request as playwrightRequest, APIRequestContext } from '@playwright/test';
import { BookStoreAPI } from '../pages/bookstore.api';

test.describe('BookStore API - Negative Tests', () => {
  let bookStoreApi: BookStoreAPI;
  let token: string;
  let userId: string;
  let apiContext: APIRequestContext;
  const testUser = {
    userName: `testUser_${Date.now()}`,
    password: 'Test@123'
  };

  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext();
    bookStoreApi = new BookStoreAPI(apiContext);
    try {
      // Create user and get token
      const createUserResponse = await bookStoreApi.createUser(testUser);
      expect(createUserResponse.ok()).toBeTruthy();
      const userResult = await createUserResponse.json();
      userId = userResult.userID;

      const tokenResponse = await bookStoreApi.generateToken(testUser);
      expect(tokenResponse.ok()).toBeTruthy();
      const tokenResult = await tokenResponse.json();
      token = tokenResult.token;
    } catch (err) {
      await apiContext.dispose();
      throw err;
    }
  });

  test.afterAll(async () => {
    if (apiContext) {
      await apiContext.dispose();
    }
  });

  test('should fail to get book with invalid ISBN', async () => {
    const response = await bookStoreApi.getBook('invalid-isbn');
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  test('should fail to add book with invalid ISBN', async () => {
    const response = await bookStoreApi.addBook(userId, 'invalid-isbn', token);
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  test('should fail to add book with invalid token', async () => {
    const allBooksResponse = await bookStoreApi.getAllBooks();
    const books = await allBooksResponse.json();
    const testBook = books.books[0];
    
    const response = await bookStoreApi.addBook(userId, testBook.isbn, 'invalid-token');
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });

  test('should fail to update book with invalid ISBN', async () => {
    const response = await bookStoreApi.updateBook(userId, 'invalid-isbn', 'another-invalid-isbn', token);
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  test('should fail to delete book with invalid ISBN', async () => {
    const response = await bookStoreApi.deleteBook(userId, 'invalid-isbn', token);
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  test('should fail to delete book with invalid token', async () => {
    const allBooksResponse = await bookStoreApi.getAllBooks();
    const books = await allBooksResponse.json();
    const testBook = books.books[0];
    
    const response = await bookStoreApi.deleteBook(userId, testBook.isbn, 'invalid-token');
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });
});
