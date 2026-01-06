/**
 * Panther Maritime - Interactive JavaScript
 * Handles navigation, calendar, animations, and form interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initCalendar();
    initScrollAnimations();
    initSmoothScroll();
    initFormHandlers();
});

/**
 * Navigation Handler
 * Handles mobile menu toggle and scroll-based navbar styling
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Calendar Component
 * Placeholder calendar with availability indicators
 */
function initCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const monthDisplay = document.querySelector('.calendar-month');
    const prevBtn = document.querySelector('.calendar-nav.prev');
    const nextBtn = document.querySelector('.calendar-nav.next');
    const selectedDateInput = document.getElementById('selectedDate');

    let currentDate = new Date();
    let selectedDate = null;

    // Mock availability data (in real app, this would come from an API)
    const availability = {
        'available': [5, 6, 7, 12, 13, 14, 19, 20, 21, 26, 27, 28],
        'limited': [8, 15, 22, 29],
        'unavailable': [1, 2, 3, 4, 9, 10, 11, 16, 17, 18, 23, 24, 25, 30, 31]
    };

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = new Date();

        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        monthDisplay.textContent = `${monthNames[month]} ${year}`;

        // Get first day and number of days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Clear previous days
        calendarDays.innerHTML = '';

        // Add empty cells for days before the first day
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;

            const dayDate = new Date(year, month, day);
            const isToday = dayDate.toDateString() === today.toDateString();
            const isPast = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

            if (isToday) {
                dayEl.classList.add('today');
            }

            if (isPast) {
                dayEl.classList.add('disabled');
            } else {
                // Add availability status
                if (availability.available.includes(day)) {
                    dayEl.classList.add('available');
                } else if (availability.limited.includes(day)) {
                    dayEl.classList.add('limited');
                }

                // Click handler for selecting date
                dayEl.addEventListener('click', () => selectDate(dayEl, day, month, year));
            }

            calendarDays.appendChild(dayEl);
        }
    }

    function selectDate(element, day, month, year) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Add selection to clicked day
        element.classList.add('selected');

        // Update selected date
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        selectedDateInput.value = `${monthNames[month]} ${day}, ${year}`;

        // Add visual feedback
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }

    function navigateMonth(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        renderCalendar(currentDate);

        // Add animation
        calendarDays.style.opacity = '0';
        calendarDays.style.transform = direction > 0 ? 'translateX(20px)' : 'translateX(-20px)';

        setTimeout(() => {
            calendarDays.style.transition = 'all 0.3s ease';
            calendarDays.style.opacity = '1';
            calendarDays.style.transform = 'translateX(0)';
        }, 50);
    }

    // Event listeners
    prevBtn.addEventListener('click', () => navigateMonth(-1));
    nextBtn.addEventListener('click', () => navigateMonth(1));

    // Initial render
    renderCalendar(currentDate);
}

/**
 * Scroll Reveal Animations
 * Adds reveal class to elements as they enter viewport
 */
function initScrollAnimations() {
    // Add reveal class to sections
    const sections = document.querySelectorAll('.about, .fleet, .tours, .booking, .contact');
    const cards = document.querySelectorAll('.fleet-card, .tour-card, .feature');

    sections.forEach(section => {
        section.classList.add('reveal');
    });

    cards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Smooth Scroll
 * Handles smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Form Handlers
 * Handles form submissions with visual feedback
 */
function initFormHandlers() {
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.querySelector('.contact-form');

    function handleSubmit(form, successMessage) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.3"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round">
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                    </path>
                </svg>
                Processing...
            `;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '&#10003; ' + successMessage;
                submitBtn.style.background = '#22c55e';

                // Reset after delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    form.reset();

                    // Clear selected date if booking form
                    const dateInput = document.getElementById('selectedDate');
                    if (dateInput) {
                        dateInput.value = '';
                        document.querySelectorAll('.calendar-day.selected').forEach(el => {
                            el.classList.remove('selected');
                        });
                    }
                }, 2000);
            }, 1500);
        });
    }

    if (bookingForm) handleSubmit(bookingForm, 'Request Sent!');
    if (contactForm) handleSubmit(contactForm, 'Message Sent!');
}

/**
 * Parallax Effect for Hero (subtle)
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

/**
 * Add hover effects to buttons
 */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
        const x = e.clientX - this.getBoundingClientRect().left;
        const y = e.clientY - this.getBoundingClientRect().top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
