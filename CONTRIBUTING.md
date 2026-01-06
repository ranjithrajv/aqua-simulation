# Contributing to Aquarium Tank Simulator

Thank you for your interest in contributing to the Aquarium Tank Simulator! 🎉 This project aims to provide an accurate and user-friendly tool for aquarium enthusiasts to design and plan their tanks.

We welcome contributions of all kinds - from bug fixes and feature requests to documentation improvements and UI/UX enhancements.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Documentation](#documentation)

## 🤝 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors
- Help create a positive community

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - for running validation scripts
- **Python 3** - for running the local development server
- **Git** - for version control
- **A modern web browser** - for testing the application

### Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/aquarium-simulator.git
   cd aquarium-simulator
   ```
3. **Start the development server**:
   ```bash
   python3 -m http.server 8000
   ```
4. **Open your browser** and navigate to `http://localhost:8000/app/`
5. **Start contributing!** 🎯

## 🛠️ Development Setup

### Environment Setup

1. **Install dependencies** (if any future dependencies are added):
   ```bash
   # No npm dependencies currently required
   # Future: npm install
   ```

2. **Run validation** to ensure everything is working:
   ```bash
   node tests/validate.js
   ```

3. **Run tests** to verify functionality:
   ```bash
   node tests/test-calculations.js
   ```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines below

3. **Test your changes**:
   - Run validation: `node tests/validate.js`
   - Test in browser: Open `http://localhost:8000/app/`
   - Run unit tests: `node tests/test-calculations.js`

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

## 📁 Project Structure

```
aquarium-simulator/
├── app/                    # Main application
│   ├── index.html         # Main HTML file
│   ├── css/
│   │   └── styles.css     # Application styles
│   └── js/
│       ├── app.js         # Main application logic
│       ├── constants.js   # Application constants
│       ├── dom-helper.js  # DOM manipulation utilities
│       ├── tank-calculator.js     # Volume calculations
│       ├── glass-recommendations.js # Glass thickness logic
│       ├── equipment-recommendations.js # Equipment suggestions
│       ├── equipment-strategy.js   # Strategy pattern for equipment
│       └── tank-visualizer.js      # 3D visualization
├── tests/                  # Testing infrastructure
│   ├── validate.js         # Comprehensive validation
│   ├── test-calculations.js # Unit tests
│   ├── test.html          # Integration tests
│   ├── test-controls.html # UI control tests
│   └── README.md          # Test documentation
├── README.md              # Project documentation
└── CONTRIBUTING.md        # This file
```

## 📝 Development Guidelines

### Code Style

#### JavaScript
- Use **ES6+ features** (modules, arrow functions, template literals)
- Follow **consistent naming**: camelCase for variables/functions, PascalCase for classes
- Use **descriptive variable names** and **clear comments**
- Implement **error handling** with try-catch blocks
- Use **const/let** instead of var

#### CSS
- Use **CSS custom properties** (CSS variables) for theming
- Follow **BEM methodology** for class naming when possible
- Maintain **responsive design** principles
- Use **semantic class names** that describe purpose

#### HTML
- Use **semantic HTML5** elements
- Maintain **accessibility** with proper ARIA labels
- Keep **clean, readable structure**
- Use **data attributes** for JavaScript hooks

### Architecture Principles

#### SOLID Principles
- **Single Responsibility**: Each class/function has one clear purpose
- **Open-Closed**: Code is open for extension, closed for modification
- **Liskov Substitution**: Subtypes are substitutable for base types
- **Interface Segregation**: Prefer small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

#### DRY (Don't Repeat Yourself)
- Extract **reusable utilities** (like DOMHelper)
- Use **constants** for magic numbers
- Create **generic functions** instead of duplicating logic

### Commit Guidelines

Follow conventional commit format:

```bash
# Features
git commit -m "feat: add new equipment recommendation"

# Bug fixes
git commit -m "fix: correct volume calculation error"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor: simplify DOM manipulation logic"

# Testing
git commit -m "test: add unit tests for calculator"

# Breaking changes
git commit -m "feat!: redesign equipment recommendation API"
```

### Pull Request Guidelines

1. **Create descriptive PR titles** that explain the change
2. **Provide detailed descriptions** of what was changed and why
3. **Reference related issues** with `#issue-number`
4. **Include screenshots** for UI changes
5. **Test thoroughly** before submitting
6. **Keep PRs focused** - one feature or fix per PR

## 🧪 Testing

### Running Tests

```bash
# Comprehensive validation
node tests/validate.js

# Unit tests for calculations
node tests/test-calculations.js

# Integration tests (requires browser)
# Start server: python3 -m http.server 8000
# Open: http://localhost:8000/tests/test.html
```

### Writing Tests

#### Unit Tests
- Test individual functions/classes in isolation
- Mock external dependencies (DOM, APIs)
- Focus on edge cases and error conditions
- Place tests in `tests/` directory

#### Integration Tests
- Test complete user workflows
- Verify UI interactions work correctly
- Test responsive design on different screen sizes

### Test Coverage Goals

- **Critical functions**: 100% coverage (calculations, recommendations)
- **UI interactions**: 80% coverage (form submissions, button clicks)
- **Error handling**: 90% coverage (invalid inputs, network failures)

## 📤 Submitting Changes

### Pull Request Process

1. **Fork the repository** and create your branch
2. **Ensure tests pass** locally
3. **Update documentation** if needed
4. **Squash commits** if there are multiple related commits
5. **Create a pull request** with:
   - Clear title describing the change
   - Detailed description of what was implemented
   - Screenshots for UI changes
   - Links to related issues

### Review Process

1. **Automated checks** run on your PR
2. **Code review** by maintainers
3. **Testing** in different environments
4. **Approval** and merge, or feedback for revisions

### What to Include in PR Description

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## Screenshots (if applicable)
<!-- Add screenshots here -->

## Related Issues
Closes #123
```

## 🐛 Reporting Issues

### Bug Reports

Use the bug report template and include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Browser and OS** information
- **Screenshots** if applicable
- **Console errors** or logs

### Feature Requests

Use the feature request template and include:

- **Clear description** of the proposed feature
- **Use case** - why is this feature needed?
- **Implementation ideas** if you have any
- **Mockups or examples** if applicable

### Issue Labels

- `🐛 bug` - Something isn't working
- `✨ enhancement` - New feature or improvement
- `📚 documentation` - Documentation updates
- `🔧 maintenance` - Code refactoring or maintenance
- `❓ question` - Questions or discussions

## 📖 Documentation

### Updating Documentation

- Keep README.md current with new features
- Update inline code comments for complex logic
- Maintain API documentation in code comments
- Update this CONTRIBUTING.md file as processes evolve

### Documentation Standards

- Use **Markdown** for all documentation
- Include **code examples** where helpful
- Keep language **clear and concise**
- Use **consistent formatting** throughout

## 🎯 Areas for Contribution

### High Priority
- **Performance optimization** - Improve calculation speed and UI responsiveness
- **Accessibility improvements** - Better keyboard navigation and screen reader support
- **Cross-browser testing** - Ensure compatibility across different browsers

### Medium Priority
- **Additional equipment recommendations** - More aquarium equipment options
- **Unit conversion improvements** - Support for more measurement systems
- **Mobile optimization** - Better responsive design for phones/tablets

### Future Enhancements
- **Internationalization** - Support for multiple languages
- **Offline functionality** - PWA capabilities
- **Advanced visualizations** - More detailed 3D tank representations

## 📞 Getting Help

If you need help or have questions:

1. **Check existing issues** - Your question might already be answered
2. **Search the documentation** - README.md and this file cover most topics
3. **Create a discussion** - Use GitHub Discussions for questions
4. **Open an issue** - For bugs or feature requests

## 🙏 Recognition

Contributors will be recognized in:
- The project README.md contributors section
- GitHub's contributor insights
- Release notes for significant contributions

Thank you for contributing to the Aquarium Tank Simulator! 🐠✨