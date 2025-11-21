// script.js - live preview + optional submit to Apps Script (replace APPS_SCRIPT_URL)
const form = document.getElementById('internForm');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
const APPS_SCRIPT_URL = ''; // paste your Apps Script URL here if you want to submit

// preview elements
const fields = {
  fullName: document.getElementById('p-name'),
  email: document.getElementById('p-email'),
  phone: document.getElementById('p-phone'),
  github: document.getElementById('p-github'),
  linkedin: document.getElementById('p-linkedin'),
  role: document.getElementById('p-role'),
  skill: document.getElementById('p-skill'),
  task: document.getElementById('p-task'),
  availability: document.getElementById('p-availability'),
  commit: document.getElementById('p-commit'),
  start: document.getElementById('p-start'),
  why: document.getElementById('p-why')
};

function updatePreviewFromForm() {
  const data = Object.fromEntries(new FormData(form).entries());
  fields.fullName.textContent = data.fullName || 'Full Name';
  fields.email.textContent = data.email || '—';
  fields.phone.textContent = data.phone || '—';
  fields.github.textContent = data.github || '—';
  fields.linkedin.textContent = data.linkedin || '—';
  fields.role.textContent = data.role || '—';
  fields.skill.textContent = data.skill || '—';
  fields.task.textContent = data.taskAnswer || '—';
  fields.availability.textContent = data.availability || '—';
  fields.commit.textContent = data.commit || '—';
  fields.start.textContent = data.startDate || '—';
  fields.why.textContent = data.why || '—';
}

// wire inputs to preview
form.querySelectorAll('input, textarea, select').forEach(el => {
  el.addEventListener('input', updatePreviewFromForm);
  el.addEventListener('change', updatePreviewFromForm);
});
updatePreviewFromForm();

// submit handler (optional)
form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  submitBtn.disabled = true;
  statusEl.textContent = 'Submitting...';

  const data = Object.fromEntries(new FormData(form).entries());
  data.submittedAt = new Date().toISOString();

  if (!APPS_SCRIPT_URL) {
    // demo mode: just show success and reset
    setTimeout(() => {
      statusEl.textContent = 'Demo submission complete (no remote configured).';
      form.reset();
      updatePreviewFromForm();
      submitBtn.disabled = false;
    }, 700);
    return;
  }

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json && json.result === 'success') {
      statusEl.textContent = 'Thanks — your application has been submitted.';
      form.reset();
      updatePreviewFromForm();
    } else {
      statusEl.textContent = 'Submission failed. Server error.';
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Submission failed. Network error.';
  } finally {
    submitBtn.disabled = false;
  }
});
