

const openButtons = document.querySelectorAll(".open-btn");
const closeButtons = document.querySelectorAll(".close-modal");

openButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const dialogID = button.dataset.dialog;
        const dialog = document.getElementById(dialogID);
        if (dialog) {
            dialog.showModal();

        }
    });
});

closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const dialog = button.closest("dialog");
        if (dialog) {
            dialog.close();
        }
    });
});

window.addEventListener("click", (event) => {
    if (event.target instanceof HTMLDialogElement) {
        event.target.close();
    }
});