import "./style.css";

/* ==========================================================================
   📦 EASY PROJECT MANAGER (Add or edit projects right here!)
   Want to add a new project without touching HTML? Just copy one block below,
   paste it inside EXTRA_PROJECTS, and save!
   Categories: "web-sec" | "disc-sec" | "alg-sec" | "net-sec" | "roblox-sec"
   Pastel styles: "card-pastel-yellow" | "card-pastel-blue" | "card-pastel-pink" | "card-pastel-green" | "card-pastel-purple"
   ========================================================================== */
const EXTRA_PROJECTS = [
    // Example block (uncomment or copy to add more projects automatically):
    /*
    {
        category: "web-sec",
        colorClass: "card-pastel-yellow",
        image: "project-2.jpg", // 📸 REPLACE PHOTO HERE
        alt: "Screenshot of my new project",
        tags: ["Web", "Frontend"],
        title: "My Awesome New Project", // ✏️ EDIT TITLE HERE
        description: "Write as much detail as you want here! The card will show a neat 3-line preview, and clicking the card will open the overlay with your full story.", // ✏️ EDIT DESCRIPTION HERE
        link: "https://github.com/", // Leave empty "" or null if Not Live!
        isLive: true
    }
    */
];

document.addEventListener("DOMContentLoaded", () => {
    const projectsGrid = document.getElementById("projects-grid");

    // 1. Render any projects added to the EXTRA_PROJECTS list above
    if (projectsGrid && EXTRA_PROJECTS.length > 0) {
        EXTRA_PROJECTS.forEach((proj) => {
            const card = document.createElement("article");
            card.className = `project-card ${proj.category} ${proj.colorClass || "card-pastel-yellow"}`;
            card.setAttribute("data-category", proj.category);

            const tagsHtml = (proj.tags || [])
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("");

            const actionButtonHtml =
                proj.isLive === false || !proj.link
                    ? `<button type="button" class="btn btn-card btn-disabled" disabled aria-disabled="true">Not Live 🔒</button>`
                    : `<a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="btn btn-card">View project <span aria-hidden="true">→</span></a>`;

            card.innerHTML = `
                <div class="card-image-wrap">
                    <img src="${proj.image}" alt="${proj.alt || proj.title}">
                    <span class="card-zoom-hint" aria-hidden="true">🔍 Click to expand</span>
                </div>
                <div class="card-body">
                    <div class="card-tags">${tagsHtml}</div>
                    <h3 class="card-title">${proj.title}</h3>
                    <p class="card-desc">${proj.description}</p>
                    ${actionButtonHtml}
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // 2. Safety check: automatically disable any card button whose text says "Not live" or "No live"
    document.querySelectorAll(".btn-card").forEach((btn) => {
        const text = btn.textContent.trim().toLowerCase();
        if (text.includes("not live") || text.includes("no live")) {
            btn.classList.add("btn-disabled");
            btn.setAttribute("aria-disabled", "true");
            if (btn.tagName === "A") {
                btn.removeAttribute("href");
            } else {
                btn.disabled = true;
            }
        }
    });

    // 3. Project Showcase Modal Overlay Logic
    const modal = document.getElementById("project-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalImg = document.getElementById("modal-img");
    const modalTags = document.getElementById("modal-tags");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalAction = document.getElementById("modal-action");

    const openProjectModal = (card) => {
        if (!modal) return;

        const imgEl = card.querySelector(".card-image-wrap img");
        const tagsEl = card.querySelector(".card-tags");
        const titleEl = card.querySelector(".card-title");
        const descEl = card.querySelector(".card-desc");
        const btnEl = card.querySelector(".btn-card");

        if (imgEl) {
            modalImg.src = imgEl.src;
            modalImg.alt = imgEl.alt || "";
        }
        modalTags.innerHTML = tagsEl ? tagsEl.innerHTML : "";
        modalTitle.textContent = titleEl ? titleEl.textContent.trim() : "";

        // Normalize whitespace from multi-line HTML paragraphs while keeping full description
        const rawDesc = card.getAttribute("data-long-desc") || (descEl ? descEl.textContent : "");
        modalDesc.textContent = rawDesc.replace(/\s+/g, " ").trim();

        modalAction.innerHTML = "";
        if (btnEl) {
            const clonedBtn = btnEl.cloneNode(true);
            modalAction.appendChild(clonedBtn);
        }

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeProjectModal = () => {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    // Make every project card clickable and keyboard-accessible
    document.querySelectorAll(".project-card").forEach((card) => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");

        card.addEventListener("click", (e) => {
            // If user clicked directly on an active "View project" link, let the link open normally
            const clickedLink = e.target.closest("a.btn-card:not(.btn-disabled)");
            if (clickedLink) return;

            openProjectModal(card);
        });

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openProjectModal(card);
            }
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeProjectModal);
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            // Close when clicking the dark backdrop outside the modal card
            if (e.target === modal) {
                closeProjectModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
            closeProjectModal();
        }
    });

    // 4. Category Filter Buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const selectedCategory = btn.getAttribute("data-filter");
            const allCards = document.querySelectorAll(".project-card");

            allCards.forEach((card) => {
                const cardCategory = card.getAttribute("data-category");
                if (selectedCategory === "all" || cardCategory === selectedCategory) {
                    card.classList.remove("is-hidden");
                } else {
                    card.classList.add("is-hidden");
                }
            });
        });
    });

    // 5. One-Click "Copy Discord Handle" Button
    const copyDiscordBtn = document.getElementById("copy-discord-btn");
    const copyFeedback = document.getElementById("copy-feedback");

    if (copyDiscordBtn) {
        copyDiscordBtn.addEventListener("click", async () => {
            const discordHandle = "jhncrlmauricio.dev";
            try {
                await navigator.clipboard.writeText(discordHandle);
                copyFeedback.textContent = `🎉 Copied "${discordHandle}" to clipboard! See ya on Discord!`;
            } catch (err) {
                copyFeedback.textContent = `Discord username: ${discordHandle}`;
            }
        });
    }
});