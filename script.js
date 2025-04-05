// Wait for the DOM to be fully loaded
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