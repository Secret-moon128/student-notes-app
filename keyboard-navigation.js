/**
 * Reusable Keyboard Navigation and Focus Outline Accessibility Helper
 * Improves keyboard focus visibility and keyboard controls.
 */
(function() {
    document.addEventListener("DOMContentLoaded", () => {
        // Apply focus visual indicator styles dynamically
        const style = document.createElement("style");
        style.id = "keyboard-nav-accessibility-styles";
        style.innerHTML = `
            /* Focus outline style only active for keyboard navigation users */
            body.user-is-tabbing *:focus {
                outline: 3px solid var(--accent, #2563eb) !important;
                outline-offset: 3px !important;
            }
            
            /* Accessibility Skip to Content style */
            .skip-to-content {
                position: absolute;
                top: -60px;
                left: 10px;
                background: var(--accent, #2563eb);
                color: white;
                padding: 10px 16px;
                border-radius: 4px;
                z-index: 100000;
                font-family: sans-serif;
                font-size: 13px;
                font-weight: bold;
                text-decoration: none;
                transition: top 0.2s ease;
            }
            .skip-to-content:focus {
                top: 10px;
            }
        `;
        document.head.appendChild(style);

        // Setup Skip to Content link dynamically if not present
        if (!document.querySelector(".skip-to-content")) {
            const skipLink = document.createElement("a");
            skipLink.href = "#main-content";
            skipLink.className = "skip-to-content";
            skipLink.innerText = "Skip to main content";
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Set main element id if present
            const main = document.querySelector("main") || document.getElementById("project-grid");
            if (main && !main.id) {
                main.id = "main-content";
            }
        }

        // Detect tab key press to toggle focus outlines
        window.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                document.body.classList.add("user-is-tabbing");
            }
        });

        window.addEventListener("mousedown", () => {
            document.body.classList.remove("user-is-tabbing");
        });
    });
})();
