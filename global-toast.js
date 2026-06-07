/**
 * Global Toast Alert Notification Utility
 * Provides a lightweight, responsive, and accessible Toast system for sub-projects.
 */
(function() {
    const Toast = {
        container: null,

        /**
         * Initialize toast container in the DOM.
         */
        init: function() {
            if (this.container) return;
            this.container = document.createElement("div");
            this.container.id = "global-toast-container";
            this.container.style.position = "fixed";
            this.container.style.top = "20px";
            this.container.style.right = "20px";
            this.container.style.zIndex = "11000";
            this.container.style.display = "flex";
            this.container.style.flexDirection = "column";
            this.container.style.gap = "10px";
            document.body.appendChild(this.container);
        },

        /**
         * Show a toast message.
         * @param {string} message - Toast message body.
         * @param {string} type - 'success', 'error', 'info', or 'warning'.
         * @param {number} duration - Time in ms before removal.
         */
        show: function(message, type = "info", duration = 3000) {
            this.init();

            const toast = document.createElement("div");
            toast.className = `global-toast toast-${type}`;
            toast.setAttribute("role", "alert");
            toast.setAttribute("aria-live", "assertive");
            
            let icon = "ℹ️";
            if (type === "success") icon = "✅";
            if (type === "error") icon = "❌";
            if (type === "warning") icon = "⚠️";

            toast.innerHTML = `
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close-btn" aria-label="Close alert">&times;</button>
            `;

            this.container.appendChild(toast);

            // Add show class after DOM mount for transition
            setTimeout(() => toast.classList.add("show"), 10);

            const closeBtn = toast.querySelector(".toast-close-btn");
            closeBtn.addEventListener("click", () => {
                this.remove(toast);
            });

            // Auto-remove
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        },

        remove: function(toast) {
            toast.classList.remove("show");
            toast.addEventListener("transitionend", () => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            });
        }
    };

    window.Toast = Toast;
})();
