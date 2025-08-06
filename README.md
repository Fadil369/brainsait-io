# BrainSAIT - Healthcare Technology Solutions

A modern, bilingual (English/Arabic) healthcare technology website for BrainSAIT, featuring comprehensive healthcare solutions for Saudi Arabia.

## Features

### 🌐 Bilingual Support
- Seamless English ↔ Arabic language switching
- Complete RTL (Right-to-Left) support for Arabic
- Localized content and UI elements
- User preference persistence

### ♿ Accessibility First
- WCAG 2.1 AA compliant
- Full keyboard navigation support
- Screen reader optimized
- ARIA labels and semantic HTML
- Skip links and focus management

### 📱 Responsive Design
- Mobile-first approach
- Cross-device compatibility
- Touch-friendly interactions
- Optimized for all screen sizes

### 🚀 Performance Optimized
- Lazy loading for images
- Critical CSS inlined
- Optimized resource loading
- Minimal bundle size
- Progressive Web App ready

### 💳 Payment Integration
- Stripe payment gateway
- PayPal integration
- Secure payment processing
- Multiple pricing plans

### 🏥 Healthcare Focus
- Medical product showcase
- Patient portal integration
- Healthcare analytics
- Industry-specific features

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Fadil369/brainsait-io.git
cd brainsait-io
```

2. Open `index.html` in your browser or serve with a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000` to view the website

## Project Structure

```
brainsait-io/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   ├── styles.css       # Main CSS styles
│   │   └── rtl.css          # RTL support for Arabic
│   ├── js/
│   │   └── main.js          # Main JavaScript functionality
│   ├── images/              # Image assets
│   └── fonts/               # Web fonts (optional)
├── README.md                # This file
├── CONTRIBUTING.md          # Contribution guidelines
└── LICENSE                  # License file
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Code Style
- Semantic HTML5
- Modern CSS with CSS Custom Properties
- Vanilla JavaScript (ES6+)
- BEM methodology for CSS classes
- Progressive enhancement

### Accessibility Testing
- Use screen readers (NVDA, JAWS, VoiceOver)
- Test keyboard navigation
- Verify color contrast ratios
- Validate with axe-core

### Performance Testing
- Lighthouse audit
- WebPageTest
- Core Web Vitals monitoring

## Deployment

### Static Hosting
The website can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Azure Static Web Apps

### CDN and Performance
- Enable gzip compression
- Set proper cache headers
- Optimize images
- Use a CDN for assets

### Security
- Implement Content Security Policy (CSP)
- Use HTTPS
- Secure payment endpoints
- Regular security audits

## Features Documentation

### Language Switching
The website supports seamless language switching between English and Arabic:
- Click the language toggle in the navigation
- Language preference is saved in localStorage
- Browser language detection on first visit
- Complete RTL layout transformation

### Payment Integration
Secure payment processing with multiple options:
- Stripe for credit/debit cards
- PayPal for PayPal accounts
- Form validation and error handling
- Loading states and success feedback

### Accessibility Features
- Skip links for keyboard navigation
- Proper heading hierarchy
- Alt text for all images
- Form labels and error messages
- Focus indicators and management

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Website: [https://brainsait.io](https://brainsait.io)
- Email: info@brainsait.io
- Phone: +966 12 345 6789

## Acknowledgments

- Design inspiration from modern healthcare websites
- Accessibility guidelines from WCAG 2.1
- Performance best practices from Google Web.dev
- Arabic typography best practices