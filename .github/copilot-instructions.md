# Copilot Instructions for Markdown Table Prettifier VS Code Extension

## Project Overview

This is a **VS Code extension** that formats and prettifies Markdown tables to make them more readable. The extension is also available as an **NPM package**, **CLI tool**, and **Docker image**.

### Key Features
- Formats Markdown tables with proper alignment and spacing
- Supports column alignment (left, center, right) using `:` markers
- Handles table borders intelligently (adds/removes as needed)
- Supports indented tables and empty columns
- Provides configurable column padding
- Available as VS Code extension, CLI tool, NPM package, and Docker image

## Architecture Overview

The codebase follows a **layered architecture** with clear separation of concerns:

### Core Layers
1. **Models** (`src/models/`) - Core data structures (Table, Row, Cell, Alignment)
2. **Model Factories** (`src/modelFactory/`) - Create and transform models from raw text
3. **View Models** (`src/viewModels/`) - Presentation layer models (TableViewModel, RowViewModel)
4. **View Model Factories** (`src/viewModelFactories/`) - Convert models to view models
5. **Writers** (`src/writers/`) - Convert view models to formatted strings
6. **Prettyfiers** (`src/prettyfiers/`) - Main formatting orchestration

### Key Components
- **MultiTablePrettyfier**: Finds and formats multiple tables in a document
- **SingleTablePrettyfier**: Formats individual tables
- **TableFactory**: Parses raw text into Table models
- **TableValidator**: Validates table structure
- **TableFinder**: Locates tables within documents
- **PadCalculators**: Handle column padding and alignment

## File Structure Guidelines

### Source Code Organization
- `src/extension/` - VS Code extension integration
- `src/models/` - Core domain models
- `src/modelFactory/` - Model creation and transformation
- `src/viewModels/` - Presentation models
- `src/viewModelFactories/` - View model creation
- `src/writers/` - String output generation
- `src/prettyfiers/` - Main formatting logic
- `src/padCalculation/` - Column padding calculations
- `src/tableFinding/` - Table detection logic
- `src/diagnostics/` - Logging and diagnostics
- `cli/` - Command-line interface
- `test/` - Unit and system tests

### Test Organization
- `test/unitTests/` - Unit tests mirroring source structure
- `test/systemTests/` - End-to-end tests with input/expected files
- `test/stubs/` - Test doubles and mocks

## Coding Standards

### TypeScript Guidelines
- Use **strict TypeScript** with proper typing
- Prefer **composition over inheritance**
- Use **dependency injection** patterns
- Follow **SOLID principles**
- Use **readonly** for immutable data
- Prefer **private readonly** for dependencies

### Class Design Patterns
```typescript
// Example class structure
export class ExampleClass {
    constructor(
        private readonly _dependency: IDependency,
        private readonly _logger: ILogger
    ) { }

    public method(): ReturnType {
        // Implementation
    }
}
```

### Error Handling
- Use **descriptive error messages**
- Validate inputs at public method boundaries
- Use **null checks** for critical operations
- Log errors appropriately based on context

### Naming Conventions
- Use **descriptive names** for classes and methods
- Private fields prefixed with `_`
- Interfaces prefixed with `I` when needed
- Test methods describe behavior: `"methodName() with condition returns expected result"`

## Testing Guidelines

### Unit Tests
- Use **Mocha** with **TDD style** (`suite`/`test`)
- Use **TypeMoq** for mocking dependencies
- Test structure: **Arrange, Act, Assert**
- One assertion per test when possible
- Use descriptive test names explaining the scenario

### Test Patterns
```typescript
suite("ClassName tests", () => {
    let _mockDependency: IMock<IDependency>;

    setup(() => {
        _mockDependency = Mock.ofType<IDependency>();
    });

    test("methodName() with valid input returns expected result", () => {
        // Arrange
        const sut = createSut();
        const input = "test input";
        const expected = "expected output";
        _mockDependency.setup(m => m.method(input)).returns(() => expected);

        // Act
        const result = sut.method(input);

        // Assert
        assert.strictEqual(result, expected);
        _mockDependency.verify(m => m.method(input), Times.once());
    });

    function createSut(): ClassName {
        return new ClassName(_mockDependency.object);
    }
});
```

### System Tests
- Test files in `test/systemTests/resources/`
- Input files: `testname-input.md`
- Expected files: `testname-expected.md`
- Tests both CLI and VS Code formatter

## VS Code Extension Patterns

### Extension Structure
- **Extension activation**: `src/extension/extension.ts`
- **Command registration**: Document formatters and commands
- **Configuration**: Use VS Code workspace configuration
- **Factory pattern**: `prettyfierFactory.ts` creates instances

### Key Extension Files
- `extension.ts` - Entry point and activation
- `prettyfierFactory.ts` - Dependency injection container
- `tableDocumentPrettyfier.ts` - Document formatting provider
- `tableDocumentRangePrettyfier.ts` - Range formatting provider
- `tableDocumentPrettyfierCommand.ts` - Manual command execution

## Configuration

### VS Code Settings
- `markdownTablePrettify.maxTextLength` - Size limit for formatting
- `markdownTablePrettify.extendedLanguages` - Additional language support
- `markdownTablePrettify.columnPadding` - Extra column spacing
- `markdownTablePrettify.showWindowMessages` - UI message control

### CLI Options
- `--check` - Validate formatting without changes
- `--columnPadding=N` - Set column padding

## Performance Considerations

### Size Limits
- Default 1M character limit for VS Code extension
- No limits for CLI/NPM usage
- Use `SizeLimitChecker` implementations

### Caching
- Cache factory instances in VS Code extension
- Invalidate cache on configuration changes

### Benchmarking
- Performance tests in `test/systemTests/benchmarkRunner.ts`
- Measure factory creation and document formatting
- Results stored in `benchmark-results-*.json`

## Common Patterns

### Dependency Injection
Classes receive dependencies via constructor injection:
```typescript
constructor(
    private readonly _tableFactory: TableFactory,
    private readonly _validator: TableValidator,
    private readonly _logger: ILogger
) { }
```

### Factory Pattern
Use factories to create complex object graphs:
```typescript
export function getDocumentPrettyfier(): vscode.DocumentFormattingEditProvider {
    return new TableDocumentPrettyfier(getMultiTablePrettyfier());
}
```

### Strategy Pattern
Use strategies for different behaviors (alignment, padding):
```typescript
export class PadCalculatorSelector {
    public getCalculator(alignment: Alignment): BasePadCalculator {
        // Return appropriate calculator based on alignment
    }
}
```

## Build and Distribution

### Build Scripts
- `npm run compile` - TypeScript compilation
- `npm run test` - Run all tests
- `npm run benchmark` - Performance benchmarks
- `npm run dist` - Create NPM distribution

### Multi-Target Distribution
- **VS Code Extension**: Published to marketplace
- **NPM Package**: Core logic for Node.js/web
- **CLI Tool**: Standalone command-line interface
- **Docker Image**: Containerized CLI

## Common Operations

### Adding New Features
1. Create models in `src/models/` if needed
2. Add business logic in appropriate layer
3. Update factories for dependency injection
4. Add unit tests mirroring source structure
5. Add system tests with input/expected files
6. Update configuration if needed

### Adding New Tests
1. Create test file in matching `test/unitTests/` directory
2. Use TypeMoq for mocking dependencies
3. Follow naming convention: `className.test.ts`
4. For system tests, add input/expected file pairs

### Debugging
- Use VS Code debugger with TypeScript source maps
- Check logs via `ILogger` implementations
- Use system tests for end-to-end verification

## Integration Points

### VS Code APIs
- `vscode.languages.registerDocumentFormattingEditProvider`
- `vscode.languages.registerDocumentRangeFormattingEditProvider`
- `vscode.commands.registerTextEditorCommand`
- `vscode.workspace.getConfiguration`

### NPM Package
- Entry point: `cli/cliPrettify.js`
- Exports `CliPrettify` class with static methods
- Supports both CommonJS and ES modules

### CLI Interface
- Entry point: `cli/index.ts`
- Argument parsing: `cli/argumentsParser.ts`
- Stdin/stdout handling: `cli/inputReader.ts`
