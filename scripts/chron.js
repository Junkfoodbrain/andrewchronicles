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

const ORDER_STORAGE_KEY = "preorder-orders";
const EMAIL_STORAGE_KEY = "preorder-emails";

function getStoredOrders() {
    try {
        const raw = localStorage.getItem(ORDER_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Could not parse saved orders.", error);
        return [];
    }
}

function saveStoredOrders(orders) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function saveEmailToList(email) {
    try {
        const raw = localStorage.getItem(EMAIL_STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const emails = Array.isArray(list) ? list : [];
        if (!emails.includes(email)) {
            emails.push(email);
            localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(emails));
        }
    } catch (error) {
        console.error("Could not save email to list.", error);
    }
}

function convertOrdersToCsv(orders) {
    const headers = ["orderId", "createdAt", "firstName", "lastName", "email", "shipping", "quantity", "note", "status"];
    const escapeValue = (value) => {
        const text = String(value ?? "").replace(/"/g, '""');
        return `"${text}"`;
    };

    const rows = orders.map((order) => {
        return [
            order.orderId,
            order.createdAt,
            order.firstName,
            order.lastName,
            order.email,
            order.shipping,
            order.quantity,
            order.note,
            order.status
        ].map(escapeValue).join(",");
    });

    return [headers.join(","), ...rows].join("\n");
}

// --storing orders to a csv file for export, not a real database but will be updated later---

function downloadCsv(filename, csvContent) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

const preorderForm = document.querySelector("#preorder-form");
const exportOrdersButton = document.querySelector("#export-orders");
const clearOrdersButton = document.querySelector("#clear-orders");

if (preorderForm) {
    preorderForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!preorderForm.checkValidity()) {
            preorderForm.reportValidity();
            return;
        }

        const formData = new FormData(preorderForm);
        const status = document.querySelector("#preorder-message");

        const order = {
            orderId: `AC-${Date.now()}`,
            createdAt: new Date().toISOString(),
            firstName: String(formData.get("firstName") || "").trim(),
            lastName: String(formData.get("lastName") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            shipping: String(formData.get("shipping") || "").trim(),
            quantity: String(formData.get("quantity") || "").trim(),
            note: String(formData.get("note") || "").trim(),
            status: "Pending payment"
        };

        const orders = getStoredOrders();
        orders.push(order);
        saveStoredOrders(orders);
        saveEmailToList(order.email);

        if (status) {
            status.textContent = "Pre-order saved locally. Redirecting to thank-you page...";
        }

        preorderForm.reset();
        window.setTimeout(() => {
            window.location.href = "thankyou.html";
        }, 350);
    });
}

if (exportOrdersButton) {
    exportOrdersButton.addEventListener("click", () => {
        const orders = getStoredOrders();
        if (!orders.length) {
            alert(
                "No saved orders were found for this site context.\n\n" +
                `Current origin: ${window.location.origin || "file://"}\n\n` +
                "Make sure you submitted test orders from order.html in the same browser/profile and same URL (same origin/port)."
            );
            return;
        }
        const dateStamp = new Date().toISOString().slice(0, 10);
        const csv = convertOrdersToCsv(orders);
        downloadCsv(`andrew-chronicles-orders-${dateStamp}.csv`, csv);
    });
}

if (clearOrdersButton) {
    clearOrdersButton.addEventListener("click", () => {
        const shouldClear = window.confirm("Clear all saved orders and emails from this browser?");
        if (!shouldClear) {
            return;
        }
        localStorage.removeItem(ORDER_STORAGE_KEY);
        localStorage.removeItem(EMAIL_STORAGE_KEY);
        alert("Saved order data has been cleared from this browser.");
    });
}

// ---------------chronology data loader--------------

async function loadChronologyFromJson() {
    const chronologyBody = document.querySelector("#chronology-body");
    if (!chronologyBody) {
        return;
    }

    try {
        const response = await fetch("data/chronology.json", { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const entries = await response.json();
        if (!Array.isArray(entries)) {
            throw new Error("Chronology data is not an array.");
        }

        chronologyBody.innerHTML = "";

        entries.forEach((entry) => {
            const date = typeof entry?.date === "string" ? entry.date.trim() : "";
            const details = typeof entry?.details === "string" ? entry.details.trim() : "";

            if (!date || !details) {
                return;
            }

            const row = document.createElement("tr");
            const dateCell = document.createElement("td");
            const detailsCell = document.createElement("td");

            dateCell.className = "date-col";
            dateCell.textContent = date;
            detailsCell.textContent = details;

            row.appendChild(dateCell);
            row.appendChild(detailsCell);
            chronologyBody.appendChild(row);
        });
    } catch (error) {
        // Keep existing HTML rows as a fallback if JSON cannot be loaded.
        console.error("Could not load chronology JSON data.", error);
    }
}

loadChronologyFromJson();