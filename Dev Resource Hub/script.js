const resources = [
    {
        title: "DSA Roadmap",
        category: "DSA",
        link: "https://roadmap.sh/datastructures-and-algorithms"
    },
    {
        title: "Frontend Roadmap",
        category: "Web Development",
        link: "https://roadmap.sh/frontend"
    },
    {
        title: "Backend Roadmap",
        category: "Web Development",
        link: "https://roadmap.sh/backend"
    },
    {
        title: "Open Source Guide",
        category: "Open Source",
        link: "https://opensource.guide"
    },
    {
        title: "GitHub Skills",
        category: "GitHub",
        link: "https://skills.github.com"
    }
];

const resourceContainer = document.getElementById("resources");

function displayResources(data) {
    resourceContainer.innerHTML = "";

    data.forEach(resource => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${resource.title}</h3>
            <p>${resource.category}</p>
            <a href="${resource.link}" target="_blank">
                Visit Resource
            </a>
        `;

        resourceContainer.appendChild(card);
    });
}

displayResources(resources);

document
.getElementById("search")
.addEventListener("input", function () {

    const query = this.value.toLowerCase();

    const filtered = resources.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query)
    );

    displayResources(filtered);
});