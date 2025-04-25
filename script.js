const animated = document.getElementById('stack-animated-text');
document.querySelectorAll('.tech-stack-item').forEach(item => {
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
            animated.style.color = '';
            animated.classList.remove('switching');
        }, 300);
    });
});
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
    // const detailIcon = document.getElementById('project-detail-icon'); // If using icon in details

    if (!projectListContainer || !descriptionPane || !detailImage || !detailTitle || !detailDescription || !detailTagsContainer || !detailLiveLink || !detailGithubLink) {
        console.error("One or more required project elements not found.");
        return;
    }

    // Function to update the right description pane
    function updateDescriptionPane(projectCard) {
        if (!projectCard) return;

        const data = projectCard.dataset; // Get all data attributes

        // --- Populate Details ---
        detailImage.src = data.imgSrc || ''; // Set image source
        detailImage.alt = data.title ? `${data.title} preview` : 'Project preview';

        detailTitle.textContent = data.title || 'Project Details';

        // detailIcon.src = data.iconSrc || ''; // If using icon in details

        detailDescription.innerHTML = data.description || '<p>No description available.</p>'; // Use innerHTML as description contains HTML tags

        // --- Populate Tags ---
        detailTagsContainer.innerHTML = ''; // Clear existing tags
        try {
            const tags = JSON.parse(data.tags || '[]'); // Parse JSON string, default to empty array
            if (Array.isArray(tags)) {
                tags.forEach(tagText => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'tag';
                    tagElement.textContent = tagText;
                    detailTagsContainer.appendChild(tagElement);
                });
            }
        } catch (e) {
            console.error("Failed to parse project tags JSON:", data.tags, e);
        }

        // --- Populate Buttons ---
        // Live Link
        if (data.liveLink) {
            detailLiveLink.href = data.liveLink;
            detailLiveLink.style.display = 'inline-block'; // Show button
        } else {
            detailLiveLink.style.display = 'none'; // Hide button
        }

        // GitHub Link
        if (data.githubLink) {
            detailGithubLink.href = data.githubLink;
            detailGithubLink.style.display = 'inline-block'; // Show button
        } else {
            detailGithubLink.style.display = 'none'; // Hide button
        }

        // Optional: Scroll description pane to top if content changes significantly
        descriptionPane.querySelector('.description-content').scrollTop = 0;
    }

    // Event Listener for clicks on project cards (using delegation)
    projectListContainer.addEventListener('click', (event) => {
        // Find the closest project-card element that was clicked or is an ancestor
        const clickedCard = event.target.closest('.project-card');

        if (clickedCard && !clickedCard.classList.contains('active')) {
            // Remove 'active' class from currently active card
            const currentActive = projectListContainer.querySelector('.project-card.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }

            // Add 'active' class to the clicked card
            clickedCard.classList.add('active');

            // Update the description pane
            updateDescriptionPane(clickedCard);
        }
    });

    // --- Initial Load ---
    // Find the initially active card
    const initialActiveCard = projectListContainer.querySelector('.project-card.active');
    if (initialActiveCard) {
        updateDescriptionPane(initialActiveCard); // Populate pane on load
    } else {
        // Fallback: If no card has .active class initially, activate the first one
        const firstCard = projectListContainer.querySelector('.project-card');
        if (firstCard) {
             firstCard.classList.add('active');
             updateDescriptionPane(firstCard);
        } else {
            descriptionPane.innerHTML = '<p>No projects found.</p>'; // Handle empty state
        }
    }

}); // End DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {

    // --- START: Typing Text Animation ---
    const typingElement = document.getElementById('typing-tagline');
    const roles = ["Data Analyst", "Graphic Designer", "Software Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100; // Milliseconds per character
    const deletingSpeed = 50; // Faster when deleting
    const delayBetweenRoles = 1500; // Pause after typing a role

    function type() {
        const currentRole = roles[roleIndex];
        let textToShow = '';

        if (isDeleting) {
            // Remove characters
            textToShow = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add characters
            textToShow = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        typingElement.textContent = textToShow;

        let delay = isDeleting ? deletingSpeed : typingSpeed;

        // Check if finished typing or deleting
        if (!isDeleting && charIndex === currentRole.length) {
            // Finished typing the role
            delay = delayBetweenRoles; // Pause before starting to delete
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting the role
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length; // Move to the next role (loop)
            delay = typingSpeed * 2; // Short pause before typing next role
        }

        setTimeout(type, delay);
    }

    // Start the typing animation if the element exists
    if (typingElement) {
        setTimeout(type, 500); // Initial delay before starting
    }
    // --- END: Typing Text Animation ---


    // --- START: Modal Logic (Existing Code) ---
    // Get modal elements
    const modal = document.getElementById('projectModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalLink = document.getElementById('modalLink');
    const closeBtn = modal.querySelector('.close-btn');
    const body = document.body; // Get the body element

    // Get all "View Details" buttons
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');

    // Function to open the modal
    function openModal(title, imgSrc, description, link) {
        modalTitle.textContent = title;
        modalImg.src = imgSrc;
        modalImg.alt = title; // Set alt text for accessibility
        modalDescription.textContent = description;

        // Handle the link button visibility and href
        if (link && link !== '#') {
            modalLink.href = link;
            modalLink.style.display = 'inline-block'; // Show the button
        } else {
            modalLink.style.display = 'none'; // Hide the button if no valid link
        }

        modal.classList.add('active'); // Add class to show modal and trigger CSS animation
        body.classList.add('modal-open'); // Add class to body to disable scrolling
    }

    // Function to close the modal
    function closeModal() {
        modal.classList.remove('active');
        body.classList.remove('modal-open'); // Remove class from body to restore scrolling
    }

    // Add click event listener to each "View Details" button
    viewProjectBtns.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.project-card'); // Find the parent project card
            if (!card) return; // Safety check

            // Get data from data-* attributes
            const title = card.dataset.title || 'Project Title'; // Provide defaults
            const imgSrc = card.dataset.imgSrc || 'placeholder-project.png';
            const description = card.dataset.description || 'No description available.';
            const link = card.dataset.link; // Will be undefined if attribute doesn't exist

            openModal(title, imgSrc, description, link);
        });
    });

    // Add click event listener to the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Add click event listener to the modal overlay (to close when clicking outside content)
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Optional: Close modal on Escape key press
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
    // --- END: Modal Logic ---

}); // End DOMContentLoaded
