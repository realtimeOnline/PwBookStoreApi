# BookStore API Testing Framework

This project is an API testing framework for the BookStore API (https://bookstore.toolsqa.com) using Playwright with TypeScript.

## Features

- API tests using Playwright
- TypeScript support
- Allure reporting
- Jenkins pipeline integration
- Page Object Model pattern
- Positive and negative test scenarios
- Clean and maintainable code structure

## Prerequisites

- Node.js 18.x or higher
- npm (Node Package Manager)
- Jenkins (for CI/CD)
- Allure command-line tool (for reports)

## Project Structure

```
├── pages/
│   └── bookstore.api.ts       # API page object with all endpoints
├── tests/
│   ├── bookstore.positive.spec.ts  # Positive test scenarios
│   └── bookstore.negative.spec.ts  # Negative test scenarios
├── playwright.config.ts       # Playwright configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── Jenkinsfile             # Jenkins pipeline configuration
└── README.md               # Project documentation
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps
   ```

## Running Tests

### Running all tests
```bash
npm test
```

### Running tests in headed mode
```bash
npm run test:headed
```

### Generate and view Allure report
```bash
npm run report
```

## Test Cases

### Positive Test Scenarios
- Get all books
- Get a specific book by ISBN
- Add a book to user collection
- Update a book in user collection
- Delete a book from user collection

### Negative Test Scenarios
- Get book with invalid ISBN
- Add book with invalid ISBN
- Add book with invalid token
- Update book with invalid ISBN
- Delete book with invalid ISBN
- Delete book with invalid token

## Jenkins Integration

The project includes a Jenkinsfile that defines the CI/CD pipeline with the following stages:
1. Checkout code
2. Install dependencies
3. Run tests
4. Generate Allure report

## Reporting

The framework uses Allure for test reporting. After running the tests, you can generate and view the report using:
```bash
npm run report
```

## Best Practices Used

1. Page Object Model for better maintainability
2. Proper error handling and assertions
3. Test data separation
4. Clean code structure
5. Comprehensive documentation
6. Both positive and negative test scenarios
7. Proper type definitions with TypeScript
8. Reusable API methods

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
