const analyzeBtn = document.getElementById("analyzeBtn");
const resultBox = document.getElementById("toolResults");

analyzeBtn.addEventListener("click", () => {

    const type = document.getElementById("projectType").value;
    const desc = document.getElementById("projectDescription").value;

    if (!desc.trim()) {
        alert("Please describe your project.");
        return;
    }

    let tools = [];

    if(type.includes("Web")){
        tools = ["ChatGPT","Cursor","GitHub Copilot","Figma AI","Vercel"];
    }
    else if(type.includes("Presentation")){
        tools = ["Gamma","Canva AI","ChatGPT","Napkin AI"];
    }
    else if(type.includes("Research")){
        tools = ["Perplexity","Gemini","ChatGPT","Consensus"];
    }
    else if(type.includes("Cybersecurity")){
        tools = ["ChatGPT","Claude","Perplexity","GitHub Copilot"];
    }
    else{
        tools = ["ChatGPT","Claude","Gemini"];
    }

    resultBox.innerHTML = `
        <div class="result-card">
            <h3>Recommended AI Tools 🚀</h3>
            <p>${tools.join(" • ")}</p>
            <br>
            <h4>Suggested Workflow</h4>
            <p>Research → Planning → Design → Development → Testing → Deployment</p>
        </div>
    `;
});