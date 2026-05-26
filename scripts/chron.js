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


// adding book cover flip functionality here

const bookButton = document.querySelector(".book-button");


if (bookButton) {
    bookButton.addEventListener("click", () => {
        const isOpening = !bookButton.classList.contains("is-open");
        bookButton.classList.toggle("is-open", isOpening);
        bookButton.setAttribute("aria-pressed", String(isOpening));
    });
}

// ---------------pre-order Event Listener--------------

const preorderForm = document.querySelector("#preorder-form");
if (preorderForm) {
    preorderForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!preorderForm.checkValidity()) {
            preorderForm.reportValidity();
            return;
        }
        const formData = new FormData(preorderForm);
        const status = document.querySelector("#preorder-message");
        if (status) {
            status.textContent = "Submitting pre-order...";
        }
        const payload = {
            firstName: String(formData.get("firstName") || "").trim(),
            lastName: String(formData.get("lastName") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            quantity: String(formData.get("quantity") || "").trim(),
            address: String(formData.get("address") || "").trim(),
        };
        try {
            const response = await fetch("http://127.0.0.1:5000/api/preorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            if (status) {
                status.textContent = "Pre-order saved successfully.";
            }
            preorderForm.reset();       
        } catch (error) {
            if (status) {
                status.textContent = "Could not save pre-order. Make sure Python is running.";
            }
            console.error("Pre-order submission failed.", error);
        }        
       
    });
}