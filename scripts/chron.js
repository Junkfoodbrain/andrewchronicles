const MOBILE_NAV_BREAKPOINT = 900;

document.querySelectorAll("nav").forEach((nav) => {
    const toggleButton = nav.querySelector(".nav-toggle");
    const menu = nav.querySelector("ul");

    if (!toggleButton || !menu) {
        return;
    }

    toggleButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("nav-open");
        toggleButton.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= MOBILE_NAV_BREAKPOINT) {
                nav.classList.remove("nav-open");
                toggleButton.setAttribute("aria-expanded", "false");
            }
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > MOBILE_NAV_BREAKPOINT) {
            nav.classList.remove("nav-open");
            toggleButton.setAttribute("aria-expanded", "false");
        }
    });
});
