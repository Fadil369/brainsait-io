# Contributing to BrainSAIT

We love your input! We want to make contributing to BrainSAIT as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/Fadil369/brainsait-io/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/Fadil369/brainsait-io/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Guidelines

### Code Style

#### HTML
- Use semantic HTML5 elements
- Include proper accessibility attributes (ARIA labels, roles)
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Use meaningful alt text for images
- Ensure all form elements have labels

#### CSS
- Use CSS Custom Properties for theming
- Follow BEM methodology for class naming
- Write mobile-first responsive styles
- Use meaningful class and ID names
- Comment complex styles
- Maintain consistent spacing and formatting

#### JavaScript
- Use ES6+ features
- Write modular, reusable code
- Include proper error handling
- Add meaningful comments for complex logic
- Use camelCase for variables and functions
- Use PascalCase for classes and constructors

### Accessibility Requirements

All contributions must maintain WCAG 2.1 AA compliance:

- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Readers**: Use proper ARIA labels and semantic markup
- **Color Contrast**: Maintain minimum 4.5:1 contrast ratio for normal text
- **Focus Management**: Provide visible focus indicators
- **Alternative Text**: Include descriptive alt text for all images

### Performance Guidelines

- **Images**: Optimize images and use appropriate formats (WebP when possible)
- **JavaScript**: Minimize bundle size and use code splitting when appropriate
- **CSS**: Minimize render-blocking CSS
- **Loading**: Implement lazy loading for non-critical resources
- **Caching**: Use appropriate cache headers for static assets

### Internationalization (i18n)

When adding new content or features:

- **Text Content**: All user-facing text must have both English and Arabic translations
- **RTL Support**: Ensure proper RTL layout for Arabic content
- **Cultural Sensitivity**: Consider cultural differences in design and content
- **Font Support**: Use fonts that support Arabic characters properly
- **Date/Time**: Use locale-appropriate formatting

### Testing

#### Manual Testing Checklist

- [ ] Test in all supported browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS Safari, Chrome Mobile)
- [ ] Verify keyboard navigation works
- [ ] Test with screen reader (NVDA, VoiceOver, or JAWS)
- [ ] Verify color contrast meets WCAG standards
- [ ] Test both English and Arabic languages
- [ ] Verify RTL layout works correctly
- [ ] Test form validation and error states
- [ ] Verify payment flow (in development environment)

#### Automated Testing

- Use Lighthouse for performance and accessibility auditing
- Validate HTML with W3C validator
- Test CSS with stylelint
- Use ESLint for JavaScript code quality

### Commit Message Guidelines

Use clear and meaningful commit messages:

```
feat: add payment integration with Stripe
fix: resolve mobile menu accessibility issue
docs: update installation instructions
style: improve button hover states
refactor: modularize payment handling code
test: add keyboard navigation tests
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### File Organization

- Keep files organized in logical directories
- Use meaningful file names
- Separate concerns (HTML structure, CSS presentation, JS behavior)
- Group related files together
- Maintain consistent naming conventions

### Documentation

- Update README.md for significant changes
- Document new features or APIs
- Include code comments for complex logic
- Provide examples for new functionality
- Keep documentation up to date with code changes

## Healthcare Compliance

When working with healthcare-related features:

- **Privacy**: Ensure patient data privacy protection
- **Security**: Follow security best practices for healthcare applications
- **Compliance**: Consider healthcare regulations (HIPAA, etc.)
- **Data Handling**: Implement proper data validation and sanitization

## Getting Help

- Check existing issues before creating new ones
- Use discussion threads for questions
- Tag maintainers for urgent issues
- Provide detailed information when asking for help

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## Recognition

Contributors will be recognized in the README.md file and release notes.

Thank you for contributing to BrainSAIT! 🚀