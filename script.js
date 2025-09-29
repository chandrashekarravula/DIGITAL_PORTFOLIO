// Wait for DOM to load before initializing
        document.addEventListener('DOMContentLoaded', () => {
            initNavbar();
            initSkillBars();
            initScrollAnimations();
            initContactForm();
            initFloatingIcons();
            initScrollEffects();
            initMouseEffects();
            updateYear();
            enableSmoothScroll();
            initIdleRotation();
        });

        // 🧭 Navbar functionality
        function initNavbar() {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            const navLinks = document.querySelectorAll('.nav-link');
            const navbar = document.getElementById('navbar');

            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY > 100;
                navbar.style.background = scrolled ? 'rgba(0, 0, 0, 0.95)' : 'rg0, 0, 0, 0.8)';
                navbar.style.boxShadow = scrolled ? '0 2px 20px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.3)';
            });
        }

        // 📊 Skill bar animation on scroll
        function initSkillBars() {
            const skills = document.querySelectorAll('.skill-progress');
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = entry.target.dataset.width;
                        entry.target.style.width = width;
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            skills.forEach(skill => observer.observe(skill));
        }

        // 🎬 Scroll-triggered animations
        function initScrollAnimations() {
            const elements = document.querySelectorAll('.timeline-item, .project-card, .cert-card');
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            elements.forEach(el => observer.observe(el));
        }

        // 📩 Contact form validation
        function initContactForm() {
            const form = document.getElementById('messageForm');
            if (!form) return;

            form.addEventListener('submit', e => {
                e.preventDefault();

                const name = form.name.value.trim();
                const email = form.email.value.trim();
                const message = form.message.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!name || !email || !message) {
                    alert('Please fill in all fields');
                    return;
                }

                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address');
                    return;
                }

                alert(`Thank you for your message, ${name}! I will get back to you soon.`);
                form.reset();
            });
        }

        // 🎈 Floating icon hover effects
        function initFloatingIcons() {
            const icons = document.querySelectorAll('.floating-icon');

            icons.forEach(icon => {
                icon.addEventListener('mouseenter', () => {
                    icon.style.opacity = '1';
                    icon.style.transform = 'scale(1.5)';
                    icon.style.transition = 'all 0.3s ease';
                    icon.style.textShadow = '0 0 20px currentColor';
                });

                icon.addEventListener('mouseleave', () => {
                    icon.style.opacity = '0.7';
                    icon.style.transform = 'scale(1)';
                    icon.style.textShadow = '0 0 15px currentColor';
                });
            });
        }

        // 🌀 Scroll-based floating icon motion
        function initScrollEffects() {
            const floatingIcons = document.querySelectorAll('.floating-icon');
            let lastScrollY = window.scrollY;
            let scrollVelocity = 0;
            let lastTimestamp = 0;
            
            // Initialize offsets
            floatingIcons.forEach(icon => {
                icon.dataset.originalTop = icon.offsetTop;
                icon.dataset.originalLeft = icon.offsetLeft;
            });

            // Scroll event to capture velocity
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                const now = performance.now();
                
                // Calculate scroll velocity (pixels per frame)
                if (lastTimestamp > 0) {
                    const elapsed = now - lastTimestamp;
                    scrollVelocity = (currentScrollY - lastScrollY) / (elapsed / 16.67); // Normalize to frame time
                }
                
                lastScrollY = currentScrollY;
                lastTimestamp = now;
                
                // Apply scroll effect to icons
                floatingIcons.forEach((icon, index) => {
                    const speed = parseFloat(icon.dataset.speed) || 0.5 + index * 0.1;
                    const scrollOffset = window.scrollY * speed * 0.1;
                    
                    // Apply transform based on scroll position
                    icon.style.transform = `translateY(${scrollOffset}px)`;
                });
            });

            // Continuous animation loop for smooth movement
            function animateIcons(timestamp) {
                // Gradually reduce velocity when not scrolling
                scrollVelocity *= 0.95;
                
                requestAnimationFrame(animateIcons);
            }

            requestAnimationFrame(animateIcons); // start loop
        }

        // 🖱️ Mouse proximity effects
        function initMouseEffects() {
            const icons = document.querySelectorAll('.floating-icon');

            document.addEventListener('mousemove', e => {
                const { clientX: mouseX, clientY: mouseY } = e;

                icons.forEach(icon => {
                    const rect = icon.getBoundingClientRect();
                    const iconX = rect.left + rect.width / 2;
                    const iconY = rect.top + rect.height / 2;

                    const dx = mouseX - iconX;
                    const dy = mouseY - iconY;
                    const distance = Math.sqrt(dx ** 2 + dy ** 2);

                    if (distance < 150) {
                        const moveX = (dx / distance) * 10;
                        const moveY = (dy / distance) * 10;
                        
                        // Get current scroll transform
                        const scrollY = parseFloat(icon.style.transform?.match(/translateY\(([^)]+)px\)/)?.[1] || 0);
                        
                        // Apply both scroll and mouse transforms
                        icon.style.transform = `translateY(${scrollY}px) translate(${moveX}px, ${moveY}px)`;
                    }
                });
            });
        }

        // 📅 Dynamic year update
        function updateYear() {
            const yearSpan = document.getElementById('date');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }
        }

        // 🧭 Smooth scroll for anchor links
        function enableSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', e => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        // 🔄 Idle rotation for icons
        function initIdleRotation() {
            const icons = document.querySelectorAll('.floating-icon');
            let lastScrollPosition = window.scrollY;
            let scrollTimeout;
            let isIdle = false;
            let rotationIntervals = [];
            
            // Function to start rotation animation
            function startRotation() {
                if (isIdle) return;
                
                isIdle = true;
                console.log("Starting rotation animation");
                
                icons.forEach((icon, index) => {
                    // Determine direction: odd numbers clockwise, even numbers counter-clockwise
                    const direction = (index + 1) % 2 === 1 ? 1 : -1; // 1 for clockwise, -1 for counter-clockwise
                    
                    // Random rotation speed between 0.5 and 1.5
                    const speed = 0.5 + Math.random() * 1.0;
                    
                    // Random delay before starting (0 to 2 seconds)
                    const delay = Math.random() * 2000;
                    
                    setTimeout(() => {
                        // Set up the rotation animation
                        let rotation = 0;
                        
                        const rotateIcon = () => {
                            rotation += direction * speed;
                            icon.style.transform = `rotate(${rotation}deg)`;
                        };
                        
                        // Animate with requestAnimationFrame for smoothness
                        let lastTime = 0;
                        const rotationInterval = 16; // ~60fps
                        
                        const animate = (timestamp) => {
                            if (!lastTime) lastTime = timestamp;
                            const deltaTime = timestamp - lastTime;
                            
                            if (deltaTime > rotationInterval) {
                                rotateIcon();
                                lastTime = timestamp;
                            }
                            
                            if (isIdle) {
                                requestAnimationFrame(animate);
                            }
                        };
                        
                        requestAnimationFrame(animate);
                        
                    }, delay);
                });
            }
            
            // Function to stop rotation animation
            function stopRotation() {
                isIdle = false;
                console.log("Stopping rotation animation");
                
                icons.forEach(icon => {
                    // Smoothly return to original rotation
                    const computedStyle = window.getComputedStyle(icon);
                    const matrix = computedStyle.transform;
                    
                    if (matrix && matrix !== 'none') {
                        const values = matrix.split('(')[1].split(')')[0].split(',');
                        const a = values[0];
                        const b = values[1];
                        const angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
                        
                        // Reset transform while maintaining current rotation
                        icon.style.transition = 'transform 1s ease-out';
                        icon.style.transform = `rotate(${angle}deg)`;
                        
                        // After transition completes, remove the transition
                        setTimeout(() => {
                            icon.style.transition = '';
                        }, 1000);
                    }
                });
            }
            
            // Check if user is scrolling
            function checkScroll() {
                const currentScrollPosition = window.scrollY;
                
                if (currentScrollPosition !== lastScrollPosition) {
                    // User is scrolling
                    lastScrollPosition = currentScrollPosition;
                    
                    if (isIdle) {
                        stopRotation();
                    }
                    
                    // Clear previous timeout
                    clearTimeout(scrollTimeout);
                    
                    // Set new timeout to detect when scrolling stops
                    scrollTimeout = setTimeout(() => {
                        startRotation();
                    }, 2000); // 2 seconds after scrolling stops
                }
            }
            
            // Initial setup - start rotation if page loads and user is idle
            scrollTimeout = setTimeout(() => {
                startRotation();
            }, 5000); // 5 seconds after page load
            
            // Listen for scroll events
            window.addEventListener('scroll', checkScroll);
            
            // Also check for mouse movement to detect activity
            let mouseTimeout;
            document.addEventListener('mousemove', () => {
                if (isIdle) {
                    stopRotation();
                }
                
                clearTimeout(mouseTimeout);
                mouseTimeout = setTimeout(() => {
                    startRotation();
                }, 5000); // 5 seconds after mouse movement stops
            });
            
            // Also check for key presses to detect activity
            let keyTimeout;
            document.addEventListener('keydown', () => {
                if (isIdle) {
                    stopRotation();
                }
                
                clearTimeout(keyTimeout);
                keyTimeout = setTimeout(() => {
                    startRotation();
                }, 5000); // 5 seconds after key press
            });
        }