# Desarrolladora GAT - Website

Official website for **Desarrolladora GAT** (Gestión y Asesoría Técnica), a Costa Rican company specialized in real estate development, civil infrastructure, and consulting services.

## About

Desarrolladora GAT is a Costa Rican company with over 20 years of experience, specializing in:
- **Real Estate Development**: High-value residential projects through the NovaHomes brand
- **Civil Infrastructure**: Public and private infrastructure projects
- **Consulting Services**: Comprehensive project management and technical consulting

The company operates with a focus on integrity, commitment, and quality, using modern methodologies including the exclusive **DCI (Diseño Colaborativo Integrado / Integrated Collaborative Design)** methodology for high-value residential development.

## Website Features

- 🌐 **Bilingual Support**: Full Spanish/English language toggle
- 📱 **Responsive Design**: Optimized for all devices and screen sizes
- 🎨 **Modern UI/UX**: Clean, professional design with smooth animations
- 🔍 **SEO Optimized**: Comprehensive meta tags, structured data (JSON-LD), and sitemap
- 📧 **Contact Form**: Integrated with Formspree for form submissions
- 🗺️ **Interactive Sections**: Hero carousel, service cards, partners carousel
- ⚡ **Performance Optimized**: Lazy loading, deferred scripts, optimized images

## Project Structure

```
dev/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── main.js         # Main JavaScript functionality
│   ├── contact.js      # Contact form handling
│   ├── mision.js       # Mission/Vision section scripts
│   ├── partners.js     # Partners carousel functionality
│   └── pilares.js      # Services section scripts
├── img/                # Images and assets
│   ├── favicon.png
│   ├── GAT-Logo-*.webp
│   ├── pack1/          # Hero and general images
│   ├── partners/       # Partner logos
│   ├── sector1/        # Real estate sector images
│   ├── sector2/        # Infrastructure sector images
│   └── sector3/        # Consulting sector images
├── .htaccess           # Apache server configuration
├── robots.txt          # Search engine crawler instructions
├── sitemap.xml         # XML sitemap for SEO
└── 404.html            # Custom 404 error page
```

## Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript (Vanilla)**: No frameworks, pure JavaScript for performance
- **Formspree**: Form submission service
- **Google Fonts**: Web fonts (preconnected for performance)
- **WebP Images**: Optimized image format for better performance

## Setup & Deployment

This is a static website that can be deployed to any web server.

### Local Development

1. Clone or download the repository
2. Open `index.html` in a web browser, or
3. Use a local server (recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

### Production Deployment

The website is configured for Apache servers with:
- `.htaccess` for URL rewriting and security
- Optimized caching headers
- GZIP compression
- HTTPS redirects

Simply upload all files to your web server's root directory.

## Key Sections

1. **Hero Section**: Rotating background carousel showcasing main services
2. **Mission & Vision**: Company values and objectives
3. **History**: Company background and expertise
4. **Fundamental Pillars**: Integrity, Commitment, Quality
5. **Value Proposition**: Comprehensive services overview
6. **Services**:
   - Real Estate Sector (NovaHomes)
   - Infrastructure Development
   - Consulting Services
7. **Partners**: Strategic partners carousel
8. **Contact**: Contact form with map integration

## Contact Information

- **Website**: https://gatcr.com
- **Email**: info@gatcr.com
- **Phone**: +506 2102-7099
- **Office 1**: San Antonio de Belén, Provincia de Heredia, Costa Rica
- **Office 2**: Plaza Futura, Local No 17, Provincia de Guanacaste, Liberia, Costa Rica
- **WhatsApp**: +506 8398-3969

## Related Brands

- **NovaHomes**: High-value residential development brand
  - Website: https://www.novahomescr.com
  - Specializes in turnkey construction and premium design
  - Uses exclusive DCI methodology

## SEO Features

- Semantic HTML5 structure
- Meta tags (Open Graph, Twitter Cards)
- Structured data (JSON-LD) for Organization, LocalBusiness, WebSite
- XML Sitemap
- Robots.txt configuration
- Canonical URLs
- Optimized images with alt text

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## License

© 2026 Desarrolladora GAT. All rights reserved.

---

**Desarrolladora GAT** - Integrity, Commitment and Quality in construction.
