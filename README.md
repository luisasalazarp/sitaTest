# URL Fetcher & License Plate Generator

A JavaScript application implementing Domain-Driven Design (DDD) architecture with two main features:
- Concurrent URL fetching with customizable concurrency limit
- License plate number generation following DMV sequence patterns

## Project Structure

The application follows DDD layered architecture:

```
src/
├── application/         # Application layer (Use Cases)
│   └── useCases/
│       ├── FetchUrlsUseCase.js
│       └── LicensePlateUseCase.js
├── domain/             # Domain layer (Core business logic)
│   ├── services/
│   │   ├── ConcurrencyFetcher.js
│   │   └── LicensePlateGenerator.js
│   └── validators/
│       └── InputValidator.js
├── infrastructure/     # Infrastructure layer (UI)
│   └── ui/
│       ├── BaseView.js
│       ├── FetcherView.js
│       └── LicensePlateView.js
└── bootstrap/         # Application bootstrap
    └── index.js
```

### Layer Description

- **Domain Layer**: Contains core business logic and rules
  - `ConcurrencyFetcher`: Manages concurrent URL fetching
  - `LicensePlateGenerator`: Implements license plate generation logic
  - `InputValidator`: Validates input across the application

- **Application Layer**: Orchestrates use cases
  - `FetchUrlsUseCase`: Coordinates URL fetching functionality
  - `LicensePlateUseCase`: Manages license plate generation requests

- **Infrastructure Layer**: Handles UI and external concerns
  - `BaseView`: Base UI functionality
  - `FetcherView`: URL fetcher interface
  - `LicensePlateView`: License plate generator interface


## Testing with GithubPages

You can interact with the exercises without compiling the code if you access my GithubPages page directly.

Visit: [https://luisasalazarp.github.io/sitaTest/](https://luisasalazarp.github.io/sitaTest/)


## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)

### Installation

```bash
# Install dependencies
npm install
```

### Building the Application

```bash
# Build the application
npx webpack
```

### Running the Application

```bash
# Start the HTTP server (serves from ./public directory)
npx http-server ./public
```

Then open http://localhost:8080 in your browser.

### Running Tests

```bash
# Run all tests
npm test
```

## Features

### 1. URL Fetcher
- Enter multiple URLs (comma-separated)
- Set maximum concurrent requests
- View success/failure results for each URL
- Real-time feedback

### 2. License Plate Generator
- Generate license plates following DMV sequence
- Supports patterns from 000000 to ZZZZZZ
- Validates input and provides error feedback
- Real-time plate generation

## Test Coverage

The application includes comprehensive test suites for:
- Domain services
- Use cases
- UI components
- Input validation

## Technologies Used

- Vanilla JavaScript (ES6+)
- Webpack for bundling
- Jest for testing
- TailwindCSS for styling