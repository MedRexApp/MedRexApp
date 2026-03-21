document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initHeroImageRotation();
    initSmoothScrolling();
    initFormValidation();
});

function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

function initHeroImageRotation() {
    const images = document.querySelectorAll('.hero-image');
    const container = document.querySelector('.hero-image-container');
    if (images.length === 0 || !container) return;

    let currentIndex = 0;
    images[currentIndex].classList.add('active');

    const updateHeroHeight = (image) => {
        if (!container) return;

        // For desktop, use default CSS height
        if (window.innerWidth > 768) {
            container.style.height = '';
            return;
        }

        const targetImage = image || images[currentIndex];
        if (!targetImage) return;

        const applyHeight = () => {
            const width = container.offsetWidth;
            if (!width) return;

            const naturalWidth = targetImage.naturalWidth || 1;
            const naturalHeight = targetImage.naturalHeight || (naturalWidth * 0.5625);
            const ratio = naturalHeight / naturalWidth;
            container.style.height = `${width * ratio}px`;
        };

        if (targetImage.complete && targetImage.naturalWidth) {
            applyHeight();
        } else {
            targetImage.addEventListener('load', applyHeight, { once: true });
        }
    };

    updateHeroHeight(images[currentIndex]);

    setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
        updateHeroHeight(images[currentIndex]);
    }, 4000);

    window.addEventListener('resize', () => updateHeroHeight());
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

