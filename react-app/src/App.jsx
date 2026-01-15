import { useState } from 'react'
import './index.css'

const POSITIONS = [
  {
    id: 1,
    title: 'AI Chatbot Developer',
    type: 'Internship',
    location: 'Remote',
    duration: '2 months',
    commitment: '15-20 hrs/week',
    description: 'Build an intelligent conversational AI assistant for product discovery using RAG, Python, and LLM APIs.',
    tags: ['Python', 'LLM/RAG', 'Flask', 'AI/ML'],
    featured: true,
    introduction: 'We are looking for a motivated AI Chatbot Developer Intern to join our team and help build an intelligent product discovery assistant. You will work directly with our founding engineers on a production system serving real users.',
    responsibilities: [
      'Design and develop a conversational AI chatbot for product and business discovery',
      'Implement RAG (Retrieval-Augmented Generation) pipeline using vector databases',
      'Integrate with free LLM APIs (Gemini, Groq, OpenRouter)',
      'Build REST API endpoints using Python and Flask',
      'Write clean, documented, and testable code',
      'Participate in code reviews and technical discussions'
    ],
    requirements: [
      'Basic understanding of Python programming',
      'Familiarity with REST APIs and HTTP concepts',
      'Interest in AI/ML and natural language processing',
      'Ability to learn quickly and work independently',
      'Good communication skills'
    ],
    preferred: [
      'Experience with Flask or FastAPI',
      'Prior exposure to LLM APIs or prompt engineering',
      'Knowledge of vector databases (Pinecone, Weaviate)',
      'Understanding of database concepts (SQL/NoSQL)'
    ]
  },
  {
    id: 2,
    title: 'Frontend Intern (React)',
    type: 'Internship',
    location: 'Remote',
    duration: '2 months',
    commitment: '15-20 hrs/week',
    description: 'Work on modern React applications and learn from experienced developers building production UIs.',
    tags: ['React.js', 'JavaScript', 'CSS'],
    featured: false,
    introduction: 'Join our frontend team to build beautiful, responsive user interfaces for our web applications. You will gain hands-on experience with modern React development practices.',
    responsibilities: [
      'Develop responsive UI components using React.js',
      'Implement designs following provided specifications',
      'Write clean, reusable component code',
      'Collaborate with backend developers on API integration',
      'Participate in code reviews'
    ],
    requirements: [
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Familiarity with React.js fundamentals',
      'Understanding of component-based architecture',
      'Attention to detail in UI implementation'
    ],
    preferred: [
      'Experience with Tailwind CSS',
      'Knowledge of state management (Redux, Context)',
      'Familiarity with Git version control'
    ]
  },
  {
    id: 3,
    title: 'Backend Intern (Python + Flask)',
    type: 'Internship',
    location: 'Remote',
    duration: '2 months',
    commitment: '15-20 hrs/week',
    description: 'Build scalable backend services and REST APIs using Python and Flask for our platform.',
    tags: ['Python', 'Flask', 'PostgreSQL'],
    featured: false,
    introduction: 'We are seeking a Backend Development Intern to help build and maintain our API infrastructure. You will work on real production systems powering our mobile and web applications.',
    responsibilities: [
      'Develop RESTful API endpoints using Flask',
      'Write database queries and manage data models',
      'Implement authentication and authorization',
      'Write unit tests for backend services',
      'Document APIs and technical specifications'
    ],
    requirements: [
      'Basic Python programming skills',
      'Understanding of REST API concepts',
      'Familiarity with SQL databases',
      'Problem-solving mindset'
    ],
    preferred: [
      'Experience with Flask or Django',
      'Knowledge of PostgreSQL',
      'Understanding of cloud services (GCP, AWS)'
    ]
  },
  {
    id: 4,
    title: 'Full Stack Intern',
    type: 'Internship',
    location: 'Remote',
    duration: '2 months',
    commitment: '15-20 hrs/week',
    description: 'Get hands-on experience with both frontend and backend development on our stack.',
    tags: ['React', 'Python', 'Flask', 'PostgreSQL'],
    featured: false,
    introduction: 'This role offers a comprehensive full-stack development experience. You will work across our entire technology stack, from React frontends to Python backends.',
    responsibilities: [
      'Develop features across frontend and backend',
      'Build React components and Flask API endpoints',
      'Work with databases and data models',
      'Debug and troubleshoot issues across the stack',
      'Collaborate with team members on feature development'
    ],
    requirements: [
      'Basic knowledge of both frontend and backend development',
      'Familiarity with React and Python',
      'Understanding of web development concepts',
      'Eagerness to learn new technologies'
    ],
    preferred: [
      'Personal projects demonstrating full-stack skills',
      'Experience with version control (Git)',
      'Knowledge of deployment and DevOps basics'
    ]
  }
]

function App() {
  const [view, setView] = useState('positions') // positions | details | apply | success
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleViewDetails = (position) => {
    setSelectedPosition(position)
    setView('details')
    window.scrollTo(0, 0)
  }

  const handleApply = () => {
    setView('apply')
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    if (view === 'apply') {
      setView('details')
    } else {
      setView('positions')
      setSelectedPosition(null)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setView('success')
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="https://ekthaa.app" className="flex items-center gap-3">
            <span className="font-serif text-2xl font-bold text-brand-dark">Ekthaa</span>
            <span className="bg-brand-teal text-white text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wide">Careers</span>
          </a>
          <div className="hidden md:flex gap-8">
            <a href="https://ekthaa.app" className="text-gray-600 hover:text-brand-teal text-sm font-medium transition-colors">Home</a>
            <a href="https://ekthaa.app/about" className="text-gray-600 hover:text-brand-teal text-sm font-medium transition-colors">About</a>
          </div>
        </div>
      </nav>

      {/* Hero - Only on positions list */}
      {view === 'positions' && (
        <header className="bg-gradient-to-br from-teal-700 to-brand-teal text-white py-16 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">Build Your Future with Ekthaa</h1>
              <p className="text-lg opacity-90 mb-6 leading-relaxed">
                Join our team of innovators building the future of local commerce. Real projects. Real mentorship. Real growth.
              </p>
              <div className="flex gap-3">
                <a href="#positions" className="bg-white text-brand-teal px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
                  View Positions
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: POSITIONS.length, label: 'Open Roles' },
                { value: 'Remote', label: 'Location' },
                { value: '2 Months', label: 'Duration' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5 text-center">
                  <span className="block text-2xl font-bold mb-1">{stat.value}</span>
                  <span className="text-sm opacity-80">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Positions List */}
      {view === 'positions' && (
        <section id="positions" className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-brand-dark mb-2">Open Positions</h2>
            <p className="text-gray-500 mb-10">Explore our current internship opportunities</p>
            <div className="grid md:grid-cols-2 gap-6">
              {POSITIONS.map((position) => (
                <article
                  key={position.id}
                  className={`bg-white border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:border-brand-teal ${position.featured ? 'border-l-4 border-l-brand-teal' : 'border-gray-200'}`}
                  onClick={() => handleViewDetails(position)}
                >
                  {position.featured && (
                    <span className="inline-block bg-brand-teal text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase mb-3">Featured</span>
                  )}
                  <h3 className="text-lg font-semibold text-brand-dark mb-1">{position.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 mb-3">
                    <span>{position.type}</span>
                    <span>{position.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{position.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {position.tags.map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{position.duration} | {position.commitment}</span>
                    <span className="text-brand-teal text-sm font-medium">View Details →</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Job Details Page - IBM Style */}
      {view === 'details' && selectedPosition && (
        <>
          {/* Job Header */}
          <header className="bg-teal-50 border-b border-teal-100 py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <button onClick={handleBack} className="text-brand-teal text-sm font-medium mb-4 hover:underline flex items-center gap-1">
                ← Back to search results
              </button>
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-brand-dark mb-2">{selectedPosition.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>{selectedPosition.location}</span>
                    <span>|</span>
                    <span>{selectedPosition.type}</span>
                    <span>|</span>
                    <span>{selectedPosition.duration}</span>
                  </div>
                </div>
                <button
                  onClick={handleApply}
                  className="bg-brand-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                >
                  Apply now
                </button>
              </div>
            </div>
          </header>

          {/* Job Content - Two Column */}
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_320px] gap-10">
              {/* Main Content */}
              <div className="space-y-8">
                {/* Introduction */}
                <div>
                  <h2 className="text-xl font-bold text-brand-dark mb-4">Introduction</h2>
                  <p className="text-gray-700 leading-relaxed">{selectedPosition.introduction}</p>
                </div>

                {/* Your Role and Responsibilities */}
                <div>
                  <h2 className="text-xl font-bold text-brand-dark mb-4">Your Role and Responsibilities</h2>
                  <ul className="space-y-3">
                    {selectedPosition.responsibilities.map((item, i) => (
                      <li key={i} className="flex gap-3 text-gray-700">
                        <span className="text-brand-teal font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Skills */}
                <div>
                  <h2 className="text-xl font-bold text-brand-dark mb-4">Required Technical and Professional Expertise</h2>
                  <ul className="space-y-3">
                    {selectedPosition.requirements.map((item, i) => (
                      <li key={i} className="flex gap-3 text-gray-700">
                        <span className="text-brand-teal font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preferred Skills */}
                {selectedPosition.preferred && (
                  <div>
                    <h2 className="text-xl font-bold text-brand-dark mb-4">Preferred Technical and Professional Expertise</h2>
                    <ul className="space-y-3">
                      {selectedPosition.preferred.map((item, i) => (
                        <li key={i} className="flex gap-3 text-gray-700">
                          <span className="text-gray-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Apply Button at bottom */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={handleApply}
                    className="bg-brand-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                  >
                    Apply now
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4">Job Details</h3>
                  <dl className="space-y-4">
                    {[
                      { label: 'Job ID', value: `EK-${selectedPosition.id.toString().padStart(4, '0')}` },
                      { label: 'Employment Type', value: 'Internship (Unpaid)' },
                      { label: 'Duration', value: selectedPosition.duration },
                      { label: 'Weekly Commitment', value: selectedPosition.commitment },
                      { label: 'Work Arrangement', value: selectedPosition.location },
                      { label: 'Certificate', value: 'Provided upon completion' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <dt className="text-gray-500">{item.label}</dt>
                        <dd className="font-medium text-brand-dark text-right">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4">What You Will Gain</h3>
                  <ul className="space-y-3">
                    {[
                      'Real production experience',
                      'Mentorship from founders',
                      'Portfolio-ready project',
                      'Official completion certificate',
                      'Potential future opportunities'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-brand-teal rounded-full mt-1.5 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-3">About Ekthaa</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Ekthaa is building the future of local commerce, connecting customers with local businesses and products through technology.
                  </p>
                  <a href="https://ekthaa.app/about" className="text-brand-teal text-sm font-medium hover:underline">
                    Learn more about us →
                  </a>
                </div>

                <button
                  onClick={handleApply}
                  className="w-full bg-brand-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                >
                  Apply now
                </button>
              </aside>
            </div>
          </section>
        </>
      )}

      {/* Application Form */}
      {view === 'apply' && selectedPosition && (
        <section className="bg-gray-50 py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="mb-8 pb-6 border-b border-gray-200">
                <button onClick={handleBack} className="text-brand-teal text-sm font-medium mb-4 hover:underline">
                  ← Back to job details
                </button>
                <h2 className="font-serif text-2xl font-bold text-brand-dark">
                  Apply for <span className="text-brand-teal">{selectedPosition.title}</span>
                </h2>
                <p className="text-gray-500 text-sm mt-2">Complete the form below to submit your application</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4 pb-2 border-b-2 border-brand-teal">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
                      <input type="text" name="firstName" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                      <input type="text" name="lastName" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" name="email" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
                  </div>
                </div>

                {/* Professional Profiles */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4 pb-2 border-b-2 border-brand-teal">Professional Profiles</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn Profile URL <span className="text-red-500">*</span></label>
                      <input type="url" name="linkedin" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub Profile URL <span className="text-red-500">*</span></label>
                      <input type="url" name="github" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4 pb-2 border-b-2 border-brand-teal">Availability</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Weekly Availability <span className="text-red-500">*</span></label>
                      <select name="availability" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent">
                        <option value="">Select availability</option>
                        <option value="5-10">5-10 hours/week</option>
                        <option value="10-15">10-15 hours/week</option>
                        <option value="15-20">15-20 hours/week</option>
                        <option value="20+">20+ hours/week</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Available Start Date <span className="text-red-500">*</span></label>
                      <input type="date" name="startDate" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4 pb-2 border-b-2 border-brand-teal">Documents</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Resume <span className="text-red-500">*</span></label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand-teal transition-colors relative">
                        <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required className="absolute inset-0 opacity-0 cursor-pointer" />
                        <p className="text-sm text-gray-500">Drag and drop your resume or <span className="text-brand-teal font-medium">browse</span></p>
                        <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                      {fileName && <p className="text-sm text-brand-teal font-medium mt-2">{fileName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Why should we select you? <span className="text-red-500">*</span></label>
                      <textarea name="why" rows="4" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none" />
                    </div>
                  </div>
                </div>

                {/* Agreement */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="agree" required className="w-5 h-5 mt-0.5 accent-brand-teal" />
                    <span className="text-sm text-gray-700">I understand this is an <strong>unpaid internship</strong> and I will receive a completion certificate upon successful completion.</span>
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-teal text-white py-3.5 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Success */}
      {view === 'success' && (
        <section className="min-h-[70vh] flex items-center justify-center py-16 px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-brand-teal rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold text-brand-dark mb-3">Application Submitted</h1>
            <p className="text-gray-600 mb-2">Thank you for your interest in joining Ekthaa.</p>
            <p className="text-gray-500 text-sm mb-6">We have received your application and will review it carefully. If shortlisted, you will hear from us within 5-7 business days.</p>
            <a href="https://ekthaa.app" className="inline-block bg-brand-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors">
              Visit Ekthaa
            </a>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-white/10">
          <span className="font-serif text-xl font-bold">Ekthaa</span>
          <div className="flex gap-6">
            <a href="https://ekthaa.app" className="text-gray-400 hover:text-white text-sm transition-colors">Home</a>
            <a href="https://ekthaa.app/about" className="text-gray-400 hover:text-white text-sm transition-colors">About</a>
            <a href="mailto:hr@ekthaa.app" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 text-center text-gray-500 text-sm">
          2026 Ekthaa. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
