const API_URL = 'http://localhost:3001';
let applications = [];

// Load applications on page load
document.addEventListener('DOMContentLoaded', () => {
  loadApplications();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('refreshBtn').addEventListener('click', loadApplications);
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);
  document.getElementById('searchInput').addEventListener('input', filterApplications);
  document.getElementById('positionFilter').addEventListener('change', filterApplications);
  document.getElementById('skillFilter').addEventListener('change', filterApplications);
  
  // Modal close
  document.querySelector('.close').addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal();
    }
  });
}

async function loadApplications() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const gridEl = document.getElementById('applicationsGrid');
  
  loadingEl.style.display = 'block';
  errorEl.style.display = 'none';
  gridEl.innerHTML = '';
  
  try {
    const response = await fetch(`${API_URL}/admin/applications`);
    if (!response.ok) throw new Error('Failed to fetch applications');
    
    applications = await response.json();
    loadingEl.style.display = 'none';
    
    updateStats();
    renderApplications(applications);
  } catch (error) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    errorEl.textContent = `Error loading applications: ${error.message}`;
  }
}

function updateStats() {
  const total = applications.length;
  const today = applications.filter(app => {
    const appDate = new Date(app.timestamp);
    const todayDate = new Date();
    return appDate.toDateString() === todayDate.toDateString();
  }).length;
  const withResumes = applications.filter(app => app.resume && app.resume !== '').length;
  
  document.getElementById('totalApps').textContent = total;
  document.getElementById('todayApps').textContent = today;
  document.getElementById('withResumes').textContent = withResumes;
}

function renderApplications(apps) {
  const gridEl = document.getElementById('applicationsGrid');
  gridEl.innerHTML = '';
  
  if (apps.length === 0) {
    gridEl.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1/-1;">No applications found</p>';
    return;
  }
  
  apps.forEach(app => {
    const card = createApplicationCard(app);
    gridEl.appendChild(card);
  });
}

function createApplicationCard(app) {
  const card = document.createElement('div');
  card.className = 'application-card';
  
  const fullName = `${app.firstName || ''} ${app.lastName || ''}`.trim() || 'No Name';
  const hasResume = app.resume && app.resume !== '';
  
  card.innerHTML = `
    <div class="card-header">
      <div>
        <div class="applicant-name">${fullName}</div>
        <div class="applicant-position">${app.position || 'No position specified'}</div>
      </div>
      <div class="skill-badge">⭐ ${app.skill || 'N/A'}</div>
    </div>
    <div class="card-body">
      <div class="info-row">
        <strong>📧 Email:</strong>
        <span>${app.email || 'N/A'}</span>
      </div>
      <div class="info-row">
        <strong>📱 Phone:</strong>
        <span>${app.phone || 'N/A'}</span>
      </div>
      <div class="info-row">
        <strong>💼 Status:</strong>
        <span>${app.employment || 'N/A'}</span>
      </div>
      <div class="info-row">
        <strong>📅 Start:</strong>
        <span>${app.startDate || 'N/A'}</span>
      </div>
      <div class="timestamp">
        Submitted: ${new Date(app.timestamp).toLocaleString()}
      </div>
    </div>
    <div class="card-footer">
      <button class="btn-view" onclick="viewDetails('${app.id}')">View Details</button>
      <button class="btn-download" ${!hasResume ? 'disabled' : ''} onclick="downloadResume('${app.resume}')">
        ${hasResume ? '📄 Resume' : 'No Resume'}
      </button>
    </div>
  `;
  
  return card;
}

function viewDetails(id) {
  const app = applications.find(a => a.id === id);
  if (!app) return;
  
  const fullName = `${app.firstName || ''} ${app.lastName || ''}`.trim() || 'No Name';
  const hasResume = app.resume && app.resume !== '';
  
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div class="modal-header">
      <h2>${fullName}</h2>
      <p style="color: var(--text-muted);">${app.position || 'No position specified'}</p>
    </div>
    
    <div class="detail-section">
      <h3>📋 Basic Information</h3>
      <div class="detail-row">
        <div class="detail-label">Full Name:</div>
        <div class="detail-value">${fullName}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Email:</div>
        <div class="detail-value">${app.email || 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Phone:</div>
        <div class="detail-value">${app.phone || 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Birth Date:</div>
        <div class="detail-value">${app.birthDate || 'N/A'}</div>
      </div>
    </div>
    
    <div class="detail-section">
      <h3>💼 Professional Details</h3>
      <div class="detail-row">
        <div class="detail-label">Position:</div>
        <div class="detail-value">${app.position || 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Skill Level:</div>
        <div class="detail-value">${app.skill ? '⭐'.repeat(parseInt(app.skill)) + ' (' + app.skill + '/5)' : 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">LinkedIn:</div>
        <div class="detail-value">${app.linkedin ? `<a href="${app.linkedin}" target="_blank">${app.linkedin}</a>` : 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">GitHub:</div>
        <div class="detail-value">${app.github ? `<a href="${app.github}" target="_blank">${app.github}</a>` : 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Resume:</div>
        <div class="detail-value">
          ${hasResume ? `<button class="btn-download" onclick="downloadResume('${app.resume}')">📄 Download Resume</button>` : 'No resume uploaded'}
        </div>
      </div>
    </div>
    
    <div class="detail-section">
      <h3>📅 Availability</h3>
      <div class="detail-row">
        <div class="detail-label">Weekly Hours:</div>
        <div class="detail-value">${app.availability || 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">1-2 Month Commit:</div>
        <div class="detail-value">${app.commit || 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Employment Status:</div>
        <div class="detail-value">${app.employment || 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Start Date:</div>
        <div class="detail-value">${app.startDate || 'N/A'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Unpaid Agreement:</div>
        <div class="detail-value">${app.agree || 'N/A'}</div>
      </div>
    </div>
    
    <div class="detail-section">
      <h3>💭 Why should we select you?</h3>
      <div style="padding: 16px; background: var(--bg); border-radius: 8px; margin-top: 12px;">
        ${app.why || 'No response provided'}
      </div>
    </div>
    
    <div class="detail-section">
      <h3>🕒 Submission Details</h3>
      <div class="detail-row">
        <div class="detail-label">Submitted:</div>
        <div class="detail-value">${new Date(app.timestamp).toLocaleString()}</div>
      </div>
    </div>
  `;
  
  document.getElementById('detailModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('detailModal').style.display = 'none';
}

function downloadResume(filename) {
  if (!filename) return;
  
  // If it's already a Drive link, open it directly
  if (filename.startsWith('http')) {
    window.open(filename, '_blank');
  } else {
    // Otherwise, use the download endpoint
    window.open(`${API_URL}/admin/download/${encodeURIComponent(filename)}`, '_blank');
  }
}

function filterApplications() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const positionFilter = document.getElementById('positionFilter').value;
  const skillFilter = document.getElementById('skillFilter').value;
  
  const filtered = applications.filter(app => {
    const fullName = `${app.firstName || ''} ${app.lastName || ''}`.toLowerCase();
    const email = (app.email || '').toLowerCase();
    const position = (app.position || '').toLowerCase();
    
    const matchesSearch = fullName.includes(searchTerm) || 
                         email.includes(searchTerm) || 
                         position.includes(searchTerm);
    const matchesPosition = !positionFilter || app.position === positionFilter;
    const matchesSkill = !skillFilter || app.skill === skillFilter;
    
    return matchesSearch && matchesPosition && matchesSkill;
  });
  
  renderApplications(filtered);
}

function exportToCSV() {
  if (applications.length === 0) {
    alert('No applications to export');
    return;
  }
  
  const headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'LinkedIn', 'GitHub', 
                   'Birth Date', 'Position', 'Skill', 'Availability', 'Commit', 'Employment', 
                   'Resume', 'Why', 'Start Date', 'Agree'];
  
  const csvContent = [
    headers.join(','),
    ...applications.map(app => [
      app.timestamp,
      app.firstName,
      app.lastName,
      app.email,
      app.phone,
      app.linkedin,
      app.github,
      app.birthDate,
      app.position,
      app.skill,
      app.availability,
      app.commit,
      app.employment,
      app.resume,
      `"${(app.why || '').replace(/"/g, '""')}"`,
      app.startDate,
      app.agree
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `internship-applications-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
