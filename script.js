// Dark mode toggle functionality
function initTheme() {
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme') || 'light'; // Set default theme to light

    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    toggleSwitch.checked = currentTheme === 'dark';

    function switchTheme(e) {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    toggleSwitch.addEventListener('change', switchTheme);
}

// Initialize EmailJS
(function() {
    // Initialize EmailJS with your public key
    emailjs.init("2oezVB5Cqb6WDk-Ex");
})();

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Get the form elements
    const submitBtn = this.querySelector('.submit-btn');
    const nameInput = this.querySelector('#name');
    const emailInput = this.querySelector('#email');
    const messageInput = this.querySelector('#message');
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    // Add loading class to button
    submitBtn.classList.add('loading');

    try {
        // Prepare template parameters
        const templateParams = {
            to_email: 'ymsparay@gmail.com', // Your email address where you want to receive messages
            to_name: 'Yuan Mig',
            from_name: nameInput.value,
            from_email: emailInput.value,
            message: messageInput.value,
            subject: `New Portfolio Contact from ${nameInput.value}`,
            reply_to: emailInput.value,
            sender_email: emailInput.value,
            sender_name: nameInput.value,
            site_name: 'Yuan Mig Portfolio',
            company_name: 'Yuan Mig Portfolio Website',
            company_address: 'Davao City, Philippines'
        };

        // Send email using EmailJS
        const response = await emailjs.send(
            'service_so3exrv',
            'template_tw7qo2s',
            templateParams
        );

        console.log('Email sent successfully:', response);
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        // Reset form
        event.target.reset();
    } catch (error) {
        console.error('EmailJS error:', error);
        // Show detailed error message
        showNotification(`Failed to send message: ${error.text || 'Please try again.'}`, 'error');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});

// Notification function
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add notification to page
    document.body.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Scroll Animation Handler
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();

    const header = document.querySelector('header');
    let lastScroll = 0;
    
    // Add animation classes to elements
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.setProperty('--section-index', index);
    });

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.style.setProperty('--card-index', index);
    });

    // Smooth scroll for navigation links with offset
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Get header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll to target with offset
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                document.querySelectorAll('nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                link.classList.add('active');
            }
        });
    });

    // Active navigation link handling with offset
    const navLinks = document.querySelectorAll('nav a');
    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px 0px 0px', // Adjusted for header height
        threshold: 0.1
    };

    const handleIntersect = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Observe sections for navigation
    sections.forEach(section => {
        observer.observe(section);
    });

    // Intersection Observer for scroll animations
    const animationObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, animationObserverOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, section, .project-card, .skill-category').forEach((element) => {
        animationObserver.observe(element);
    });

    // Header scroll effect - just change background opacity
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
        } else {
            header.classList.add('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const profilePhoto = document.querySelector('.profile-photo');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (hero && profilePhoto) {
            hero.style.transform = `translateY(${rate * 0.5}px)`;
            profilePhoto.style.transform = `translateZ(50px) translateY(${-rate * 0.2}px)`;
        }
    });

    // Intersection Observer for fade-in animations
    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('skill-item')) {
                    entry.target.style.animationPlayState = 'running';
                }
            }
        });
    }, fadeObserverOptions);

    // Observe all elements that should fade in
    const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .skill-item');
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
});

// Technology Quotes
const techQuotes = [
    {
        text: "Technology is best when it brings people together.",
        author: "Matt Mullenweg"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        text: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.",
        author: "Bill Gates"
    },
    {
        text: "Any sufficiently advanced technology is indistinguishable from magic.",
        author: "Arthur C. Clarke"
    },
    {
        text: "The human spirit must prevail over technology.",
        author: "Albert Einstein"
    },
    {
        text: "Technology is nothing. What's important is that you have a faith in people, that they're basically good and smart, and if you give them tools, they'll do wonderful things with them.",
        author: "Steve Jobs"
    },
    {
        text: "The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.",
        author: "Tim Berners-Lee"
    },
    {
        text: "It has become appallingly obvious that our technology has exceeded our humanity.",
        author: "Albert Einstein"
    },
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker"
    },
    {
        text: "Technology is just a tool. In terms of getting the kids working together and motivating them, the teacher is the most important.",
        author: "Bill Gates"
    }
];

// Quote Generator Modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('quote-modal');
    const quoteButton = document.getElementById('quote-button');
    const closeButton = document.querySelector('.close-modal');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    let currentQuoteIndex = -1;

    function getRandomQuote() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * techQuotes.length);
        } while (newIndex === currentQuoteIndex && techQuotes.length > 1);
        
        currentQuoteIndex = newIndex;
        return techQuotes[currentQuoteIndex];
    }

    function animateQuote() {
        const quote = getRandomQuote();
        
        // Reset animations by removing show class
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';
        
        // Trigger reflow to restart animations
        void quoteText.offsetWidth;
        void quoteAuthor.offsetWidth;
        
        // Set new content
        setTimeout(() => {
            quoteText.textContent = quote.text;
            quoteAuthor.textContent = quote.author;
            
            // Fade in the new content
            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
        }, 300);
    }

    function showQuote() {
        const quote = getRandomQuote();
        quoteText.textContent = quote.text;
        quoteAuthor.textContent = quote.author;
        modal.classList.add('show');
        
        // Add animation class after a short delay
        setTimeout(() => {
            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
        }, 100);
    }

    function hideModal() {
        // First fade out the quote content
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';
        
        // Then remove the show class after a short delay
        setTimeout(() => {
            modal.classList.remove('show');
        }, 300);
    }

    // Event Listeners
    quoteButton.addEventListener('click', showQuote);
    closeButton.addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });

    // Add click handler for getting a new quote while modal is open
    quoteButton.addEventListener('click', function() {
        if (modal.classList.contains('show')) {
            animateQuote();
        }
    });
});

// Update Philippines time
function updatePhilippinesTime() {
    const options = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const timeElement = document.getElementById('ph-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('en-US', options);
    }
}

// Update time every second
setInterval(updatePhilippinesTime, 1000);
updatePhilippinesTime(); // Initial call 