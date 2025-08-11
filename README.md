Async URL Fetcher (DDD & SOLID)
This project is a refactoring of the original application to fetch URLs asynchronously, applying Domain-Driven Design (DDD) and SOLID principles in pure JavaScript.

Repository Structure
The architecture follows a layered structure to separate responsibilities:

public/: Contains the index.html file, the application's user interface.

src/: Contains the application logic, divided into the following layers:

domain/: The business core. Here is the high-level function ConcurrencyFetcher that implements concurrency logic.

application/: Defines the application's use cases. FetchUrlsUseCase orchestrates the interaction between the user interface and domain logic.

infrastructure/: The presentation and visualization layer. AppView handles the DOM, events, and result display.

main.js: The main entry point. Responsible for instantiating and connecting all layers, acting as an "inversion of control".

Applied Design Principles
DDD (Domain-Driven Design): Business logic is isolated in the domain layer, making the code clearer and more focused on the problem.

SOLID:

Single Responsibility Principle (SRP): Each class or module has a single reason to change. For example, ConcurrencyFetcher only knows about concurrency logic, while AppView only knows about the user interface.

Dependency Inversion Principle (DIP): High-level layers (application/useCases) do not depend directly on low-level ones (infrastructure/ui), but on abstractions. This is achieved by passing dependencies through constructors or functions.

How to Use
Create a new repository and copy the file structure.

Open public/index.html in your browser.

Enter the URLs and the concurrency limit in the interface.