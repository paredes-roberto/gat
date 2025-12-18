class PartnersCarousel {
    constructor() {
        this.carousel = document.querySelector('.partners-carousel');
        this.container = document.querySelector('.partners-carousel-container');

        this.speed = 0.5; // px por frame
        this.position = 0;
        this.paused = false;

        this.init();
    }

    init() {
        if (!this.carousel || !this.container) return;

        this.duplicateItems();
        this.calculateResetPoint();
        this.bindHover();
        this.bindClicks();
        this.animate();
    }

    duplicateItems() {
        const items = [...this.carousel.children];
        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            this.carousel.appendChild(clone);
        });
    }

    calculateResetPoint() {
        this.resetPoint = this.carousel.scrollWidth / 2;
    }

    animate() {
        if (!this.paused) {
            this.position += this.speed;

            if (this.position >= this.resetPoint) {
                this.position = 0;
            }

            this.carousel.style.transform = `translateX(-${this.position}px)`;
        }

        requestAnimationFrame(() => this.animate());
    }

    bindHover() {
        this.container.addEventListener('mouseenter', () => {
            this.paused = true;
        });

        this.container.addEventListener('mouseleave', () => {
            this.paused = false;
        });
    }

    bindClicks() {
        this.carousel.addEventListener('click', e => {
            const item = e.target.closest('.partner-logo-item');
            if (!item) return;
            this.showTooltip(item);
        });
    }

    showTooltip(item) {
        const logo = item.querySelector('.partner-logo');
        const name = logo?.alt || logo?.dataset.name || 'Este socio';

        const tooltip = document.createElement('div');
        tooltip.textContent = `${name} – Haz clic para visitar su sitio web`;

        Object.assign(tooltip.style, {
            position: 'absolute',
            top: '-45px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--primary-color)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            zIndex: '10'
        });

        item.appendChild(tooltip);
        requestAnimationFrame(() => (tooltip.style.opacity = '1'));

        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PartnersCarousel();
});
