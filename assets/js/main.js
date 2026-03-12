// ===========================
// 平滑滚动（增强无障碍支持）
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // 关闭移动菜单（如果打开）
            closeMobileMenu();
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // 设置焦点到目标区域（无障碍）
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
    });
});

// ===========================
// 导航栏滚动效果
// ===========================

let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', function() {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateNavbar();
            ticking = false;
        });
        ticking = true;
    }
});

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

// ===========================
// 移动端汉堡菜单
// ===========================

const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function toggleMobileMenu() {
    const isExpanded = hamburgerMenu.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    hamburgerMenu.setAttribute('aria-expanded', newState.toString());
    mobileMenu.classList.toggle('active', newState);
    
    // 防止背景滚动
    if (newState) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    hamburgerMenu.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// 汉堡菜单点击事件
if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleMobileMenu);
    
    // 键盘支持（Enter 和 Space）
    hamburgerMenu.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
}

// 点击菜单项后关闭菜单
mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// 点击菜单外部关闭
document.addEventListener('click', function(e) {
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        const isClickInsideMenu = mobileMenu.contains(e.target);
        const isClickOnHamburger = hamburgerMenu.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger) {
            closeMobileMenu();
        }
    }
});

// 按 ESC 键关闭菜单
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
        hamburgerMenu.focus();
    }
});

// ===========================
// 联系表单处理（增强验证和反馈）
// ===========================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        
        // 显示加载状态
        submitButton.disabled = true;
        submitButton.textContent = '发送中...';
        submitButton.setAttribute('aria-busy', 'true');
        
        // 获取表单数据
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // 模拟表单提交（实际使用时替换为真实 API 调用）
        setTimeout(() => {
            // 成功反馈
            showFormSuccess();
            
            // 重置表单
            this.reset();
            
            // 恢复按钮状态
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.setAttribute('aria-busy', 'false');
        }, 1500);
    });
    
    // 实时验证反馈
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // 清除错误状态
            this.classList.remove('error');
            const errorId = `${this.id}-error`;
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.remove();
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const type = field.type;
    
    let isValid = true;
    let errorMessage = '';
    
    if (isRequired && !value) {
        isValid = false;
        errorMessage = '此项为必填项';
    } else if (type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = '请输入有效的邮箱地址';
    }
    
    if (!isValid) {
        field.classList.add('error');
        showError(field, errorMessage);
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(field, message) {
    // 移除已有错误信息
    const errorId = `${field.id}-error`;
    const existingError = document.getElementById(errorId);
    if (existingError) {
        existingError.remove();
    }
    
    // 创建错误信息元素
    const errorElement = document.createElement('p');
    errorElement.id = errorId;
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    `;
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'polite');
    
    // 插入到字段后面
    field.parentNode.insertBefore(errorElement, field.nextSibling);
    
    // 无障碍：通知屏幕阅读器
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
}

function showFormSuccess() {
    // 创建成功提示
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div style="
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
        ">
            ✅ 消息已发送！我们会尽快与您联系。
        </div>
    `;
    successMessage.setAttribute('role', 'alert');
    successMessage.setAttribute('aria-live', 'polite');
    
    contactForm.appendChild(successMessage);
    
    // 3 秒后移除
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
    
    // 滚动到成功消息
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===========================
// 服务卡片动画（Intersection Observer）
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===========================
// 页面加载动画
// ===========================

window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===========================
// 返回顶部按钮（可选增强功能）
// ===========================

function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', '返回顶部');
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        z-index: 999;
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    button.addEventListener('focus', () => {
        button.style.outline = '3px solid white';
        button.style.outlineOffset = '2px';
    });
    
    document.body.appendChild(button);
    
    // 滚动时显示/隐藏
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
}

// 初始化返回顶部按钮
createBackToTopButton();

// ===========================
// 当前导航高亮
// ===========================

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavigation);
updateActiveNavigation(); // 初始化

// 添加活动链接样式
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-links a.active,
    .mobile-nav-link.active {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
    }
`;
document.head.appendChild(activeStyle);
