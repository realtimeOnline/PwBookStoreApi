import { test, expect, request as playwrightRequest, APIRequestContext } from '@playwright/test';
import { BookStoreAPI } from '../pages/bookstore.api';

test.describe.serial('BookStore API - Positive Tests', () => {
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
      // Create user
      const createUserResponse = await bookStoreApi.createUser(testUser);
      expect(createUserResponse.ok()).toBeTruthy();
      const userResult = await createUserResponse.json();
      userId = userResult.userID;
    } catch (err) {
      await apiContext.dispose();
      throw err;
    }
  });

  //generate token before each test
  test.beforeEach(async () => {
    try {
      const tokenResponse = await bookStoreApi.generateToken(testUser);
      expect(tokenResponse.ok()).toBeTruthy();
      const tokenResult = await tokenResponse.json();
      token = tokenResult.token;
    } catch (err) {
      throw err;
    }
  });

  test.afterAll(async () => {
    if (apiContext) {
      await apiContext.dispose();
    }
  });

  test('should get all books successfully', async () => {
    const response = await bookStoreApi.getAllBooks();
    expect(response.ok()).toBeTruthy();
    const books = await response.json();
    expect(books.books.length).toBeGreaterThan(0);
  });

  test('should get a specific book by ISBN', async () => {
    // Get all books first to get a valid ISBN
    const allBooksResponse = await bookStoreApi.getAllBooks();
    const books = await allBooksResponse.json();
    const testBook = books.books[0];

    const response = await bookStoreApi.getBook(testBook.isbn);
    expect(response.ok()).toBeTruthy();
    const book = await response.json();
    expect(book.isbn).toBe(testBook.isbn);
  });

  test('should add a book to user collection', async () => {
    // Get a book ISBN to add
    const allBooksResponse = await bookStoreApi.getAllBooks();
    const books = await allBooksResponse.json();
    const testBook = books.books[0];

    const response = await bookStoreApi.addBook(userId, testBook.isbn, token);
    expect(response.ok()).toBeTruthy();
  });

  test('should update a book in user collection', async () => {
    // Get two different books for testing
    const allBooksResponse = await bookStoreApi.getAllBooks();
    const books = await allBooksResponse.json();
    const oldBook = books.books[0];
    const newBook = books.books[1];

    // First add a book
    await bookStoreApi.addBook(userId, oldBook.isbn, token);

    // Then update it
    const response = await bookStoreApi.updateBook(userId, oldBook.isbn, newBook.isbn, token);
    expect(response.ok()).toBeTruthy();
  });

  test('should delete a book from user collection', async () => {
    // Get a book ISBN to add and then delete
    const allBooksResponse = await bookStoreApi.getAllBooks();
    const books = await allBooksResponse.json();
    const testBook = books.books[0];

    // First add a book
    await bookStoreApi.addBook(userId, testBook.isbn, token);

    // Then delete it
    const response = await bookStoreApi.deleteBook(userId, testBook.isbn, token);
    expect(response.ok()).toBeTruthy();
  });
});
