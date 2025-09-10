
document.addEventListener('DOMContentLoaded', () => {
    const welcome = document.getElementById('welcome-overlay');
    if (welcome) {
        setTimeout(() => {
            welcome.classList.add('hide');
        }, 1500);
    }
});

document.querySelectorAll('.cssbuttons-io').forEach(btn => {
    let glow = document.createElement('span');
    glow.className = 'cursor-glow';
    btn.appendChild(glow);

    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left - 30) + 'px';
        glow.style.top = (e.clientY - rect.top - 15) + 'px';
        glow.style.display = 'block';
    });

    btn.addEventListener('mouseleave', () => {
        glow.style.display = 'none';
    });
});

// --- Tech Stack Animated Text ---
const animated = document.getElementById('stack-animated-text');
if (animated) { // Check if element exists before adding listeners
    document.querySelectorAll('.tech-stack-outer').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const text = this.getAttribute('data-tech');
            const color = this.getAttribute('data-color') || '#198754';
            animated.classList.add('switching');
            setTimeout(() => {
                animated.textContent = text;
                animated.style.color = color;
                animated.classList.remove('switching');
            }, 300); // Match this to your CSS transition duration (0.3s)
        });
        item.addEventListener('mouseleave', function() {
            animated.classList.add('switching');
            setTimeout(() => {
                animated.textContent = 'constantly expanding skills';
                animated.style.color = ''; // Reset color
                animated.classList.remove('switching');
            }, 300);
        });
    });
} else {
    console.warn("Element with ID 'stack-animated-text' not found.");
}

// --- Project List and Details Pane Logic ---
document.addEventListener('DOMContentLoaded', () => {

    const projectListContainer = document.getElementById('project-list');
    const descriptionPane = document.getElementById('project-details-pane');

    // Right pane elements
    const detailImage = document.getElementById('project-detail-image');
    const detailTitle = document.getElementById('project-detail-title');
    const detailDescription = document.getElementById('project-detail-description');
    const detailTagsContainer = document.getElementById('project-detail-tags');
    const detailLiveLink = document.getElementById('project-detail-live-link');
    const detailGithubLink = document.getElementById('project-detail-github-link');

    // Perform null checks robustly
    if (!projectListContainer || !descriptionPane || !detailImage || !detailTitle || !detailDescription || !detailTagsContainer || !detailLiveLink || !detailGithubLink) {
        console.error("One or more required project elements not found in the DOM.");
        // Optionally provide user feedback or stop execution if critical elements are missing
        // descriptionPane.innerHTML = "<p>Error loading project details interface.</p>";
        return; // Stop script execution for this block if essential elements are missing
    }

    // Function to update the right description pane
    function updateDescriptionPane(projectCard) {
        if (!projectCard) return;

        const data = projectCard.dataset; // Get all data attributes

        // --- Populate Details ---
        detailImage.src = data.imgSrc || ''; // Set image source
        detailImage.alt = data.title ? `${data.title} preview` : 'Project preview';

        detailTitle.textContent = data.title || 'Project Details';

        // Use innerHTML carefully - ensure data.description is trusted or sanitized if needed
        detailDescription.innerHTML = data.description || '<p>No description available.</p>';

        // --- Populate Tags ---
        detailTagsContainer.innerHTML = ''; // Clear existing tags
        try {
            const tags = JSON.parse(data.tags || '[]'); // Parse JSON string, default to empty array
            if (Array.isArray(tags)) {
                tags.forEach(tagText => {
                    const tagButton = document.createElement('button');
                    tagButton.className = 'pushable tag';
                    tagButton.type = 'button';
                    tagButton.innerHTML = `
                        <span class="shadow"></span>
                        <span class="edge"></span>
                        <span class="front">${tagText}</span>
                    `;
                    detailTagsContainer.appendChild(tagButton);
                });
            } else {
                 console.warn("Project tags data is not an array:", data.tags);
            }
        } catch (e) {
            console.error("Failed to parse project tags JSON:", data.tags, e);
        }

        // --- Populate Buttons ---
        // Live Link
        if (data.liveLink && data.liveLink !== '#') { // Check for valid link
            detailLiveLink.href = data.liveLink;
            detailLiveLink.style.display = 'inline-block'; // Show button
        } else {
            detailLiveLink.style.display = 'none'; // Hide button
        }

        // GitHub Link
        if (data.githubLink && data.githubLink !== '#') { // Check for valid link
            detailGithubLink.href = data.githubLink;
            detailGithubLink.style.display = 'inline-block'; // Show button
        } else {
            detailGithubLink.style.display = 'none'; // Hide button
        }

        // Optional: Scroll description pane to top if content changes significantly
        const descriptionContent = descriptionPane.querySelector('.description-content');
        if (descriptionContent) {
             descriptionContent.scrollTop = 0;
        }
    }

        // Event Listener for clicks on project cards (using delegation)
        projectListContainer.addEventListener('click', (event) => {
            const clickedCardDiv = event.target.closest('.project-card');
    
            if (!clickedCardDiv) {
                return; // Exit if click wasn't inside a card's content area
            }
    
            // --- Update description pane regardless of screen size ---
            try {
                updateDescriptionPane(clickedCardDiv);
            } catch (error) {
                 console.error("Error during updateDescriptionPane:", error);
            }
    
            // --- Handle active state and scrolling based on screen size ---
            if (window.innerWidth > 768) {
                // --- DESKTOP LOGIC ---
                // Add .active class only on desktop (triggers CSS expansion)
                if (!clickedCardDiv.classList.contains('active')) {
                    const currentActive = projectListContainer.querySelector('.project-card.active');
                    if (currentActive) {
                        currentActive.classList.remove('active');
                    }
                    clickedCardDiv.classList.add('active');
                }
                // Desktop scroll is handled by the default <a> tag behavior
            } else {
                // --- MOBILE LOGIC ---
                // Ensure no card appears active/expanded on mobile after click
                const currentActive = projectListContainer.querySelector('.project-card.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
    
                // Scroll to the details pane using JavaScript on mobile
                const detailsPane = document.getElementById('project-details-pane');
                if (detailsPane) {
                    detailsPane.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        }); // End Event Listener

    // --- Initial Load ---
    // Decide whether to activate a card on load based on screen size
    if (window.innerWidth > 768) {
        // On desktop, find the initially active card or activate the first one
        let initialCardToActivate = projectListContainer.querySelector('.project-card.active');
        if (!initialCardToActivate) {
             initialCardToActivate = projectListContainer.querySelector('.project-card');
        }

        if (initialCardToActivate) {
            initialCardToActivate.classList.add('active'); // Ensure it has the class
            updateDescriptionPane(initialCardToActivate); // Populate pane on load
        } else {
             // Handle empty state if no projects exist
             if (descriptionPane) {
                 descriptionPane.innerHTML = '<p>No projects found.</p>';
             }
        }
    } else {
        // On mobile, ensure NO card starts with the .active class (or handle via CSS override)
        const currentActive = projectListContainer.querySelector('.project-card.active');
         if (currentActive) {
             currentActive.classList.remove('active'); // Remove active class on mobile load
         }
         // You might still want to show *some* default content in the right pane on mobile,
         // or hide it completely until a card is tapped (if navigating to a new page/section).
         // For now, this just ensures no card is active/expanded.
         // Example: Load first project's details without activating the card itself
          const firstCard = projectListContainer.querySelector('.project-card');
          if (firstCard) {
              //updateDescriptionPane(firstCard); // Uncomment if you want initial details shown on mobile
          } else if (descriptionPane) {
             descriptionPane.innerHTML = '<p>No projects found.</p>';
          }

    }

}); // End Project List DOMContentLoaded


// --- Separate DOMContentLoaded for other functionalities ---
document.addEventListener('DOMContentLoaded', () => {

    // --- START: Typing Text Animation ---
    const typingElement = document.getElementById('typing-tagline');
    if (typingElement) {
        const roles = ["Data Analyst", "Graphic Designer", "Software Developer"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const delayBetweenRoles = 1500;

        function type() {
            // Ensure element still exists (e.g., if removed dynamically)
             if (!document.getElementById('typing-tagline')) return;

            const currentRole = roles[roleIndex];
            let textToShow = '';

            if (isDeleting) {
                textToShow = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textToShow = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            typingElement.textContent = textToShow;

            let delay = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIndex === currentRole.length) {
                delay = delayBetweenRoles;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = typingSpeed * 2;
            }

            setTimeout(type, delay);
        }
        setTimeout(type, 500); // Start after a short delay
    }
    // --- END: Typing Text Animation ---


    // --- START: Modal Logic ---
    const modal = document.getElementById('projectModal');
    const viewProjectBtns = document.querySelectorAll('.view-project-btn'); // Assuming these are still used for something else

    if (modal && viewProjectBtns.length > 0) { // Check if modal and buttons exist
        const modalImg = document.getElementById('modalImg');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalLink = document.getElementById('modalLink');
        const closeBtn = modal.querySelector('.close-btn');
        const body = document.body;

        // Check if all modal inner elements exist
        if (!modalImg || !modalTitle || !modalDescription || !modalLink || !closeBtn) {
             console.error("One or more required elements inside the modal not found.");
             return; // Stop modal logic setup if elements are missing
        }

        function openModal(title, imgSrc, description, link) {
            modalTitle.textContent = title;
            modalImg.src = imgSrc;
            modalImg.alt = title;
            modalDescription.textContent = description;

            if (link && link !== '#') {
                modalLink.href = link;
                modalLink.style.display = 'inline-block';
            } else {
                modalLink.style.display = 'none';
            }

            modal.classList.add('active');
            body.classList.add('modal-open');
        }

        function closeModal() {
            if (modal) { // Check if modal exists
                modal.classList.remove('active');
            }
            body.classList.remove('modal-open');
        }

        viewProjectBtns.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.project-card') || button.closest('.project-details-pane'); // Adjust selector if needed
                if (!card || !card.dataset) {
                     console.warn("Could not find associated data for modal button.");
                     return;
                }

                const title = card.dataset.title || 'Project Title';
                const imgSrc = card.dataset.imgSrc || 'placeholder-project.png';
                const description = card.dataset.description || 'No description available.';
                const link = card.dataset.link;

                openModal(title, imgSrc, description, link);
            });
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    // --- END: Modal Logic ---

}); // End second DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('checkbox');
    // Set initial state from localStorage
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if(toggle) toggle.checked = false; // Unchecked for dark mode
    } else {
        document.body.classList.remove('dark-mode');
        if(toggle) toggle.checked = true; // Checked for light mode
    }
    if(toggle) {
        toggle.addEventListener('change', () => {
            if(toggle.checked) {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});