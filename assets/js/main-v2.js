/**
 * Main JavaScript - AI 创新工作室官网 v2
 * 
 * 功能：
 * - 移动端菜单切换
 * - FAQ 手风琴交互
 * - 导航栏滚动效果
 * - 数字动画
 * - 平滑滚动
 * - 无障碍支持
 */

(function() {
    'use strict';
    
    // ===========================
    // DOM Elements
    // ===========================
    
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    // ===========================
    // Mobile Menu Toggle
    // ===========================
    
    function toggleMobileMenu() {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            mobileMenu.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.setAttribute('hidden', '');
            document.body.style.overflow = '';
        }
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('hidden', '');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ===========================
    // FAQ Accordion
    // ===========================
    
    function toggleFAQ(question) {
        const answer = document.getElementById(question.getAttribute('aria-controls'));
        const icon = question.querySelector('.faq-icon');
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQs
        faqQuestions.forEach(q => {
            if (q !== question) {
                q.setAttribute('aria-expanded', 'false');
                const otherAnswer = document.getElementById(q.getAttribute('aria-controls'));
                if (otherAnswer) {
                    otherAnswer.setAttribute('hidden', '');
                }
                const otherIcon = q.querySelector('.faq-icon');
                if (otherIcon) {
                    otherIcon.textContent = '+';
                }
            }
        });
        
        // Toggle current FAQ
        question.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            answer.removeAttribute('hidden');
            if (icon) icon.textContent = '−';
        } else {
            answer.setAttribute('hidden', '');
            if (icon) icon.textContent = '+';
        }
    }
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => toggleFAQ(question));
        
        // Keyboard support
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(question);
            }
        });
    });
    
    // ===========================
    // Navbar Scroll Effect
    // ===========================
    
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on load
    
    // ===========================
    // Smooth Scroll for Anchor Links
    // ===========================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, '', targetId);
            }
        });
    });
    
    // ===========================
    // Number Counter Animation
    // ===========================
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : element.textContent.includes('%') ? '%' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.parentElement.querySelector('.stat-label').textContent.includes('小时') ? '+' : element.parentElement.querySelector('.stat-label').textContent.includes('满意度') ? '%' : element.parentElement.querySelector('.stat-label').textContent.includes('交付') ? 'h' : '+');
            }
        }, 16);
    }
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => counterObserver.observe(stat));
    
    // ===========================
    // Active Navigation Highlight
    // ===========================
    
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection, { passive: true });
    
    // ===========================
    // Focus Management for Accessibility
    // ===========================
    
    // Trap focus in mobile menu when open
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }
    
    if (mobileMenu) {
        trapFocus(mobileMenu);
    }
    
    // ===========================
    // Performance: Debounce Helper
    // ===========================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ===========================
    // Initialize on DOM Ready
    // ===========================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('AI 创新工作室官网 v2 已加载');
        });
    } else {
        console.log('AI 创新工作室官网 v2 已加载');
    }
    
})();
