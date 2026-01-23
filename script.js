/* Ekthaa Careers - Enterprise Application Script */

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const positionsSection = document.getElementById('positions');
  const applicationSection = document.getElementById('apply');
  const thankYouSection = document.getElementById('thankYouSection');
  const form = document.getElementById('internForm');
  const positionSelect = document.getElementById('positionSelect');
  const selectedPositionSpan = document.getElementById('selectedPosition');
  const backBtn = document.getElementById('backToPositions');
  const submitBtn = document.getElementById('submitBtn');
  const statusDiv = document.getElementById('status');
  const fileDrop = document.getElementById('fileDrop');
  const fileInput = document.getElementById('resumeFile');
  const fileName = document.getElementById('fileName');

  // Position Apply Buttons
  const applyButtons = document.querySelectorAll('.position-apply');

  applyButtons.forEach(button => {
    button.addEventListener('click', function () {
      const position = this.getAttribute('data-position');
      
      // Check if this is the Business Calling Intern position
      if (position === 'Business Calling & Communication Intern (Direct Joining)') {
        // Redirect to external Google Form
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSdZheaiOL34vqa3slmhEO70GXoSatC8FSx7Ek52RTl1N7t-LA/viewform?usp=header', '_blank');
        return;
      }
      
      showApplicationForm(position);
    });
  });

  // Back Button
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      showPositions();
    });
  }

  // Show Application Form
  function showApplicationForm(position) {
    positionsSection.classList.add('hidden');
    document.querySelector('.why-join').classList.add('hidden');
    document.querySelector('.hero').classList.add('hidden');
    applicationSection.classList.remove('hidden');

    // Set the selected position
    if (selectedPositionSpan) {
      selectedPositionSpan.textContent = position;
    }
    if (positionSelect) {
      positionSelect.value = position;
    }

    // Scroll to top of application section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Show Positions (Back)
  function showPositions() {
    applicationSection.classList.add('hidden');
    positionsSection.classList.remove('hidden');
    document.querySelector('.why-join').classList.remove('hidden');
    document.querySelector('.hero').classList.remove('hidden');

    // Scroll to positions
    positionsSection.scrollIntoView({ behavior: 'smooth' });
  }

  // File Upload Display
  if (fileInput) {
    fileInput.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        fileName.textContent = '📎 ' + this.files[0].name;
        fileDrop.style.borderColor = 'var(--brand-teal)';
      }
    });
  }

  // Drag and Drop Visual Feedback
  if (fileDrop) {
    ['dragenter', 'dragover'].forEach(event => {
      fileDrop.addEventListener(event, function (e) {
        e.preventDefault();
        this.style.borderColor = 'var(--brand-teal)';
        this.style.background = 'rgba(20, 184, 166, 0.05)';
      });
    });

    ['dragleave', 'drop'].forEach(event => {
      fileDrop.addEventListener(event, function (e) {
        e.preventDefault();
        this.style.borderColor = '';
        this.style.background = '';
      });
    });
  }

  // Form Submission
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Disable submit button
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      statusDiv.textContent = '';

      try {
        // Collect form data
        const formData = new FormData(form);

        // Convert to JSON for display (actual submission would go to backend)
        const data = {};
        formData.forEach((value, key) => {
          if (key !== 'resume') {
            data[key] = value;
          }
        });

        console.log('Application Data:', data);

        // Simulate API call (replace with actual API endpoint)
        // In production, this would POST to your backend
        await simulateSubmission(formData);

        // Show success
        showThankYou();

      } catch (error) {
        console.error('Submission error:', error);
        statusDiv.textContent = 'Something went wrong. Please try again.';
        statusDiv.style.color = '#ef4444';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }
    });
  }

  // Simulate API Call (Replace with actual backend integration)
  async function simulateSubmission(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1500);
    });
  }

  // Show Thank You
  function showThankYou() {
    applicationSection.classList.add('hidden');
    thankYouSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }
});
