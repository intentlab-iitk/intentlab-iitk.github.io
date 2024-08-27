document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('myHeader');
    const navbar = document.getElementById('navbar');
    const navAncBox = document.getElementById('navAnchorBox');
    const MenuButton = document.querySelector('.menuBtn');
    const links = Array.from(document.querySelectorAll('header nav a[href^="#"]'));
    const sections = Array.from(document.querySelectorAll('section'));

    // Function to update active link based on scroll position
    function updateActiveLink() {
        const scrollPosition = window.scrollY + header.offsetHeight;

        sections.forEach(section => {
            const sectionId = section.getAttribute('id');
            const offsetTop = section.offsetTop - header.offsetHeight;
            const offsetHeight = section.offsetHeight;

            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                links.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + sectionId);
                });
            }
        });
    }

    // Unified function to toggle menu display
    function toggleMenu(isOpen) {
        if (window.innerWidth <= 640) {
            MenuButton.style.display = isOpen ? 'none' : 'flex';
            navAncBox.style.display = isOpen ? 'flex' : 'none';
        } else {
            MenuButton.style.display = 'none';
            navAncBox.style.display = 'flex';
        }
    }

    // Function to handle menu state based on window width
    function handleResize() {
        if (window.innerWidth > 640) {
            // On larger screens, always show the menu and hide the button
            toggleMenu(false);
        } else if (!navAncBox.classList.contains('open')) {
            // On mobile, ensure menu is closed by default if not explicitly opened
            toggleMenu(false);
        }
    }

    // Trigger handleResize on window resize
    window.addEventListener('resize', handleResize);

    // Expose toggleMenu function globally
    window.toggleMenu = toggleMenu;

    // Throttle function for scroll events
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Event listener for scrolling with throttling
    window.addEventListener('scroll', throttle(updateActiveLink, 100));

    // Smooth scroll to target section when navigation link is clicked
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            // Close the menu after clicking a link
            toggleMenu(false);
        });
    });

    // Close the menu when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!navbar.contains(event.target) && !navAncBox.contains(event.target)) {
            toggleMenu(false);
        }
    });

    // Initialize active link on page load
    updateActiveLink();
});
