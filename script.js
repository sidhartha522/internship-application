// Form submission handler
const form = document.getElementById('internForm');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
// Use relative URL so it works both locally and on production
const SERVER_URL = '/submit';

// Submit handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  statusEl.textContent = 'Submitting...';

  // Gather form data including file
  const formData = new FormData(form);

  try {
    const res = await fetch(SERVER_URL, {
      method: 'POST',
      body: formData
    });
    
    const result = await res.json();
    
    if (result.success) {
      statusEl.textContent = 'Thanks — your application has been submitted successfully!';
      statusEl.style.color = '#2d7a2d';
      form.reset();

      // Redirect to a thank-you page
      window.location.href = '/thank-you.html';
    } else {
      statusEl.textContent = 'Submission failed: ' + result.message;
      statusEl.style.color = '#a33';
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Submission failed. Please check if the server is running.';
    statusEl.style.color = '#a33';
  } finally {
    submitBtn.disabled = false;
  }
});

// Added logic to toggle between landing page and form
const landing = document.getElementById('landing');
const formContainer = document.getElementById('formContainer');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
  landing.classList.add('hidden');
  formContainer.classList.remove('hidden');
});

// Display uploaded file name
const fileInput = document.getElementById('resumeFile');
const fileNameDisplay = document.getElementById('fileName');

fileInput.addEventListener('change', (event) => {
  const fileName = event.target.files[0]?.name || '';
  fileNameDisplay.textContent = fileName ? `Selected file: ${fileName}` : '';
});
