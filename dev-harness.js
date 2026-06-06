/**
 * Local Developer Experience Responsive Test Harness
 * Creates a floating viewport simulation overlay during local development.
 */
(function() {
    // Only mount if running locally (localhost, 127.0.0.1, or file protocol)
    const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
    if (!isLocal) return;

    document.addEventListener("DOMContentLoaded", () => {
        const toggle = document.createElement("button");
        toggle.id = "dev-harness-toggle";
        toggle.innerText = "📱 Viewport Tester";
        toggle.style.position = "fixed";
        toggle.style.bottom = "20px";
        toggle.style.left = "20px";
        toggle.style.zIndex = "12000";
        toggle.style.padding = "8px 12px";
        toggle.style.borderRadius = "6px";
        toggle.style.backgroundColor = "#111318";
        toggle.style.color = "#ffffff";
        toggle.style.border = "1px solid #3b82f6";
        toggle.style.cursor = "pointer";
        toggle.style.fontSize = "11px";
        toggle.style.fontWeight = "600";

        const panel = document.createElement("div");
        panel.id = "dev-harness-panel";
        panel.style.position = "fixed";
        panel.style.bottom = "60px";
        panel.style.left = "20px";
        panel.style.zIndex = "12000";
        panel.style.backgroundColor = "#ffffff";
        panel.style.border = "1px solid #e8eaed";
        panel.style.borderRadius = "8px";
        panel.style.padding = "12px";
        panel.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
        panel.style.display = "none";
        panel.style.flexDirection = "column";
        panel.style.gap = "8px";
        panel.style.width = "180px";

        panel.innerHTML = `
            <div style="font-weight:bold;font-size:12px;color:#111318;margin-bottom:4px;">Simulate Viewport</div>
            <button class="viewport-btn" data-width="375" data-height="667" style="text-align:left;padding:6px;cursor:pointer;font-size:11px;background:none;border:1px solid #e8eaed;border-radius:4px;">iPhone SE (375x667)</button>
            <button class="viewport-btn" data-width="768" data-height="1024" style="text-align:left;padding:6px;cursor:pointer;font-size:11px;background:none;border:1px solid #e8eaed;border-radius:4px;">iPad (768x1024)</button>
            <button class="viewport-btn" data-width="1280" data-height="800" style="text-align:left;padding:6px;cursor:pointer;font-size:11px;background:none;border:1px solid #e8eaed;border-radius:4px;">Desktop (1280x800)</button>
            <button id="viewport-reset" style="text-align:left;padding:6px;cursor:pointer;font-size:11px;background:#ef4444;color:white;border:none;border-radius:4px;font-weight:bold;">Reset Viewport</button>
        `;

        document.body.appendChild(toggle);
        document.body.appendChild(panel);

        toggle.addEventListener("click", () => {
            panel.style.display = panel.style.display === "flex" ? "none" : "flex";
        });

        const btns = panel.querySelectorAll(".viewport-btn");
        btns.forEach(btn => {
            btn.addEventListener("click", () => {
                const width = btn.dataset.width;
                const height = btn.dataset.height;
                const wrapper = document.getElementById("viewport-simulator-wrapper") || document.createElement("div");
                
                if (!wrapper.id) {
                    wrapper.id = "viewport-simulator-wrapper";
                    wrapper.style.position = "fixed";
                    wrapper.style.top = "0";
                    wrapper.style.left = "0";
                    wrapper.style.width = "100vw";
                    wrapper.style.height = "100vh";
                    wrapper.style.backgroundColor = "rgba(0,0,0,0.5)";
                    wrapper.style.display = "flex";
                    wrapper.style.alignItems = "center";
                    wrapper.style.justifyContent = "center";
                    wrapper.style.zIndex = "11999";
                    
                    const content = document.createElement("iframe");
                    content.id = "viewport-iframe";
                    content.src = window.location.href;
                    content.style.border = "4px solid #111318";
                    content.style.borderRadius = "12px";
                    content.style.boxShadow = "0 12px 36px rgba(0,0,0,0.3)";
                    
                    wrapper.appendChild(content);
                    document.body.appendChild(wrapper);
                }
                
                const iframe = document.getElementById("viewport-iframe");
                iframe.style.width = `${width}px`;
                iframe.style.height = `${height}px`;
            });
        });

        panel.querySelector("#viewport-reset").addEventListener("click", () => {
            const wrapper = document.getElementById("viewport-simulator-wrapper");
            if (wrapper) {
                wrapper.parentNode.removeChild(wrapper);
            }
        });
    });
})();
