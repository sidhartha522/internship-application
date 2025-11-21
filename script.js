// Form submission handler
const form = document.getElementById('internForm');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
const SERVER_URL = 'http://localhost:3001/submit';

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
