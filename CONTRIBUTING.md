# Contributing to Platypus QA Lab

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/platypus-qa-lab.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Running Locally

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your changes.

### Running Tests

\`\`\`bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# All tests
npm test

# Watch mode
npm run test:watch
\`\`\`

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Run `npm run lint` before committing
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages

Follow conventional commits format:

\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Examples:
\`\`\`
feat(playground): add support for custom headers
fix(bugs): resolve filter not working on mobile
docs(readme): update installation instructions
\`\`\`

## Pull Request Process

1. Update documentation for any changed functionality
2. Add tests for new features
3. Ensure all tests pass
4. Update the README if needed
5. Request review from maintainers

## Code Review Guidelines

Reviewers will check for:
- Code quality and readability
- Test coverage
- Documentation completeness
- Performance implications
- Security considerations
- Humor appropriateness (yes, really!)

## Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information
- Console errors if any

## Feature Requests

When requesting features:
- Describe the problem you're trying to solve
- Explain your proposed solution
- Consider alternative approaches
- Discuss potential impact on existing features

## Testing Guidelines

### Unit Tests
- Test individual functions and components
- Mock external dependencies
- Aim for 80%+ coverage
- Include edge cases

### E2E Tests
- Test complete user workflows
- Cover critical paths
- Test error scenarios
- Ensure tests are stable (not flaky)

### Manual Testing
- Test on multiple browsers
- Test responsive design
- Test accessibility
- Test with real APIs

## Documentation

- Keep README up to date
- Document new features in `/docs`
- Add JSDoc comments for functions
- Update API documentation for endpoint changes

## Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Have fun and embrace the platypus spirit!

## Questions?

Open an issue with the `question` label or reach out to maintainers.

---

*The platypus welcomes all contributors, whether you're fixing typos or building features!*
