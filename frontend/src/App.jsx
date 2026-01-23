import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Admin from './Admin'
import AdminLogin from './AdminLogin'
import './index.css'



// Positions List Page
// Positions List Page
function PositionsPage({ positions }) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Nav />
      {/* Hero - Simplified */}
      <header className="bg-gradient-to-br from-teal-700 to-brand-teal text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Build Your Future with ekthaa</h1>
          <p className="text-lg opacity-90 max-w-2xl">Join our team of innovators building the future of local commerce. Real projects. Real mentorship. Real growth.</p>
        </div>
      </header>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-brand-dark mb-2">Open Positions</h2>
          <p className="text-gray-500 mb-8">Explore our current internship opportunities</p>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.isArray(positions) && positions.map((position) => (
              <Link to={`/job/${position.slug}`} key={position.id} className="block">
                <article className={`bg-white border p-6 transition-all hover:shadow-lg hover:border-brand-teal h-full ${position.featured ? 'border-l-4 border-l-brand-teal' : 'border-gray-200'}`}>
                  {position.featured && <span className="inline-block bg-brand-teal text-white text-[10px] font-semibold px-2 py-0.5 uppercase mb-3">Featured</span>}
                  <h3 className="font-serif text-lg font-semibold text-brand-dark mb-1">{position.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 mb-3"><span>{position.type}</span><span>{position.location}</span></div>
                  <p className="text-gray-600 text-sm mb-4">{position.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(position.tags || []).map((tag, idx) => <span key={idx} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1">{tag}</span>)}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{position.duration} | {position.commitment}</span>
                    <span className="text-brand-teal text-sm font-medium">View Details →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

// Job Details Page
function JobDetailsPage({ positions }) {
  const { slug } = useParams()
  const position = Array.isArray(positions) ? positions.find(p => p.slug === slug) : null

  if (!position) return <div className="min-h-screen bg-brand-cream flex items-center justify-center"><p>Position not found</p></div>

  return (
    <div className="min-h-screen bg-brand-cream">
      <Nav />
      <header className="bg-teal-50 border-b border-teal-100 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-brand-teal text-sm font-medium mb-4 block hover:underline">← Back to all positions</Link>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-brand-dark mb-2">{position.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600"><span>{position.location}</span><span>|</span><span>{position.type}</span><span>|</span><span>{position.duration}</span></div>
            </div>
            {position.customApplyUrl ? (
              <a href={position.customApplyUrl} target="_blank" rel="noopener noreferrer" className="bg-brand-teal text-white px-8 py-3 font-semibold hover:bg-teal-600">Apply now</a>
            ) : (
              <Link to={`/apply/${position.slug}`} className="bg-brand-teal text-white px-8 py-3 font-semibold hover:bg-teal-600">Apply now</Link>
            )}
          </div>
        </div>
      </header>
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_320px] gap-10">
          <div className="space-y-8">
            <div><h2 className="text-xl font-bold text-brand-dark mb-4">Introduction</h2><p className="text-gray-700">{position.introduction}</p></div>
            <div><h2 className="text-xl font-bold text-brand-dark mb-4">Your Role and Responsibilities</h2><ul className="space-y-3">{(position.responsibilities || []).map((item, i) => <li key={i} className="flex gap-3 text-gray-700"><span className="text-brand-teal font-bold">•</span><span>{item}</span></li>)}</ul></div>
            <div><h2 className="text-xl font-bold text-brand-dark mb-4">Required Technical and Professional Expertise</h2><ul className="space-y-3">{(position.requirements || []).map((item, i) => <li key={i} className="flex gap-3 text-gray-700"><span className="text-brand-teal font-bold">•</span><span>{item}</span></li>)}</ul></div>
            {position.preferred && Array.isArray(position.preferred) && <div><h2 className="text-xl font-bold text-brand-dark mb-4">Preferred Technical and Professional Expertise</h2><ul className="space-y-3">{position.preferred.map((item, i) => <li key={i} className="flex gap-3 text-gray-700"><span className="text-gray-400 font-bold">•</span><span>{item}</span></li>)}</ul></div>}
            <div className="pt-6 border-t border-gray-200">
              {position.customApplyUrl ? (
                <a href={position.customApplyUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-brand-teal text-white px-8 py-3 font-semibold hover:bg-teal-600">Apply now</a>
              ) : (
                <Link to={`/apply/${position.slug}`} className="inline-block bg-brand-teal text-white px-8 py-3 font-semibold hover:bg-teal-600">Apply now</Link>
              )}
            </div>
          </div>
          <aside className="space-y-6">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4">Job Details</h3>
              <dl className="space-y-4">
                {[{ label: 'Job ID', value: `EK-${position.id.toString().padStart(4, '0')}` }, { label: 'Employment Type', value: 'Internship (Unpaid)' }, { label: 'Duration', value: position.duration }, { label: 'Weekly Commitment', value: position.commitment }, { label: 'Work Arrangement', value: position.location }, { label: 'Certificate', value: 'Provided upon completion' }].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm border-b border-gray-100 pb-3 last:border-0"><dt className="text-gray-500">{item.label}</dt><dd className="font-medium text-brand-dark text-right">{item.value}</dd></div>
                ))}
              </dl>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4">What You Will Gain</h3>
              <ul className="space-y-3">{['Real production experience', 'Mentorship from founders', 'Portfolio-ready project', 'Official completion certificate'].map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><span className="w-1.5 h-1.5 bg-brand-teal mt-1.5"></span>{item}</li>)}</ul>
            </div>
            {position.customApplyUrl ? (
              <a href={position.customApplyUrl} target="_blank" rel="noopener noreferrer" className="block w-full bg-brand-teal text-white py-3 font-semibold text-center hover:bg-teal-600">Apply now</a>
            ) : (
              <Link to={`/apply/${position.slug}`} className="block w-full bg-brand-teal text-white py-3 font-semibold text-center hover:bg-teal-600">Apply now</Link>
            )}
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  )
}

// Application Form Page - Two Column with Sidebar
function ApplyPage({ positions }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const position = Array.isArray(positions) ? positions.find(p => p.slug === slug) : null

  const [resumeFile, setResumeFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    linkedin: '', github: '', birthDate: '',
    position: position?.title || '',
    skill: '', availability: '', commit: '', employment: '',
    why: '', startDate: '', agree: false
  })

  useEffect(() => {
    if (position) setFormData(prev => ({ ...prev, position: position.title }))
  }, [position])

  if (!position) return <div className="min-h-screen bg-brand-cream flex items-center justify-center"><p>Position not found</p></div>

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
      setFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => submitData.append(key, value))
      if (resumeFile) submitData.append('resume', resumeFile)

      await axios.post('/api/submit', submitData, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate(`/success/${position.slug}`)
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.response?.data?.error || 'Failed to submit' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Nav />
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Form */}
          <div className="bg-white border border-gray-200 p-8">
            <div className="mb-8 pb-6 border-b border-gray-200">
              <Link to={`/job/${position.slug}`} className="text-brand-teal text-sm font-medium mb-4 block hover:underline">← Back to job details</Link>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">Apply for <span className="text-brand-teal">{position.title}</span></h2>
              <p className="text-gray-500 text-sm mt-2">Complete the form below to submit your application</p>
            </div>
            {submitStatus?.type === 'error' && <div className="bg-red-50 text-red-700 p-4 mb-6 text-sm">{submitStatus.message}</div>}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4 pb-2 border-b-2 border-brand-teal">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">First Name <span className="text-red-500">*</span></label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name <span className="text-red-500">*</span></label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" /></div>
                </div>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" /></div>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Birth Date <span className="text-red-500">*</span></label><input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" /></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4 pb-2 border-b-2 border-brand-teal">Professional Profiles</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn Profile URL <span className="text-red-500">*</span></label><input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub Profile URL <span className="text-red-500">*</span></label><input type="url" name="github" value={formData.github} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" /></div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4 pb-2 border-b-2 border-brand-teal">Availability</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Rate your skill level (1-5) <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">{[1, 2, 3, 4, 5].map(num => <label key={num} className="flex-1"><input type="radio" name="skill" value={num} checked={formData.skill === String(num)} onChange={handleChange} required className="peer sr-only" /><span className="block text-center py-3 border border-gray-300 font-semibold text-gray-500 cursor-pointer peer-checked:bg-brand-teal peer-checked:text-white peer-checked:border-brand-teal hover:border-brand-teal">{num}</span></label>)}</div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Weekly Availability <span className="text-red-500">*</span></label><select name="availability" value={formData.availability} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"><option value="">Select availability</option><option value="5-10 hrs">5-10 hours/week</option><option value="10-15 hrs">10-15 hours/week</option><option value="15-20 hrs">15-20 hours/week</option><option value="20+ hrs">20+ hours/week</option></select></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Can you commit for 1-2 months? <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">{['Yes', 'No'].map(opt => <label key={opt} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 cursor-pointer hover:border-brand-teal"><input type="radio" name="commit" value={opt} checked={formData.commit === opt} onChange={handleChange} required className="w-4 h-4 accent-brand-teal" /><span className="text-sm">{opt}</span></label>)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Status <span className="text-red-500">*</span></label>
                    <div className="space-y-2">{['Student', 'Recently Graduated', 'Employed', 'Self-Employed', 'Other'].map(status => <label key={status} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 cursor-pointer hover:border-brand-teal"><input type="radio" name="employment" value={status} checked={formData.employment === status} onChange={handleChange} required className="w-4 h-4 accent-brand-teal" /><span className="text-sm">{status}</span></label>)}</div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Available Start Date <span className="text-red-500">*</span></label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" /></div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4 pb-2 border-b-2 border-brand-teal">Documents</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Resume <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:border-brand-teal relative">
                      <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required className="absolute inset-0 opacity-0 cursor-pointer" />
                      <p className="text-sm text-gray-500">Drag and drop your resume or <span className="text-brand-teal font-medium">browse</span></p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                    {fileName && <p className="text-sm text-brand-teal font-medium mt-2">{fileName}</p>}
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Why should we select you? <span className="text-red-500">*</span></label><textarea name="why" value={formData.why} onChange={handleChange} rows="4" required className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none" /></div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} required className="w-5 h-5 mt-0.5 accent-brand-teal" /><span className="text-sm text-gray-700">I understand this is an <strong>unpaid internship</strong> and I will receive a completion certificate upon successful completion.</span></label>
                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-teal text-white py-3.5 font-semibold hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed">{isSubmitting ? 'Submitting...' : 'Submit Application'}</button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-white border border-gray-200 p-6">
              <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">Position Details</h4>
              {[{ label: 'Position', value: position.title }, { label: 'Type', value: 'Internship (Unpaid)' }, { label: 'Duration', value: position.duration }, { label: 'Commitment', value: position.commitment }, { label: 'Location', value: position.location }, { label: 'Certificate', value: 'Provided', highlight: true }].map((item, i) => (
                <div key={i} className="flex justify-between py-2.5 border-b border-gray-100 last:border-0 text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className={`font-medium ${item.highlight ? 'text-brand-teal' : 'text-brand-dark'}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">What You Will Gain</h4>
              <ul className="space-y-2">{['Real production experience', 'Mentorship from founders', 'Portfolio-ready project', 'Official completion certificate', 'Potential future opportunities'].map((item, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><span className="w-1.5 h-1.5 bg-brand-teal"></span>{item}</li>)}</ul>
            </div>
            <div className="bg-white border border-gray-200 p-6 text-center">
              <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-2">Questions?</h4>
              <p className="text-sm text-gray-500 mb-1">Reach out to us at</p>
              <a href="mailto:hr@ekthaa.app" className="text-brand-teal font-semibold">hr@ekthaa.app</a>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  )
}

// Success Page
function SuccessPage({ positions }) {
  const { slug } = useParams()
  const position = Array.isArray(positions) ? positions.find(p => p.slug === slug) : null

  return (
    <div className="min-h-screen bg-brand-cream">
      <Nav />
      <section className="min-h-[70vh] flex items-center justify-center py-16 px-6">
        <div className="text-center max-w-2xl">
          <div className="w-16 h-16 bg-brand-teal flex items-center justify-center mx-auto mb-6"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-3">Application Submitted</h1>
          <p className="text-gray-600 mb-2">Thank you for applying for <strong>{position?.title || 'the position'}</strong>.</p>
          <p className="text-gray-500 text-sm mb-8">We will review your application and get back to you within 5-7 business days.</p>
          
          <div className="bg-white border-2 border-brand-teal p-6 mb-6 text-left">
            <p className="text-gray-700 mb-4 leading-relaxed">
              You're not just applying for an internship - you're applying to build with us.
            </p>
            <p className="text-gray-700 mb-2">
              👉 Download <strong>Ekthaa Business</strong>, explore the app, and share your honest feedback or improvement ideas with us at <a href="https://instagram.com/sidstartsup" target="_blank" rel="noopener noreferrer" className="text-brand-teal font-semibold hover:underline">@sidstartsup</a> or <a href="https://instagram.com/ekthaa.ai" target="_blank" rel="noopener noreferrer" className="text-brand-teal font-semibold hover:underline">@ekthaa.ai</a> on Instagram.
            </p>
            <p className="text-gray-700 mb-4">
              🚀 Thoughtful and practical insights will significantly improve your chances of getting selected.
            </p>
            <a 
              href="https://play.google.com/store/apps/details?id=com.ekthaa.business" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-teal text-white px-6 py-3 font-semibold hover:bg-teal-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626c.547.317.547 1.046 0 1.364l-2.807 1.626-2.524-2.524 2.524-2.092zM5.864 2.658L16.802 8.99 14.5 11.293 5.864 2.658z"/>
              </svg>
              Download Ekthaa Business App
            </a>
          </div>
          
          <Link to="/" className="inline-block bg-gray-600 text-white px-6 py-3 font-semibold hover:bg-gray-700">View More Positions</Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}

// Shared Navigation
function Nav() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-serif text-2xl font-bold text-brand-dark">ekthaa</span>
          <span className="bg-brand-teal text-white text-xs font-semibold px-2.5 py-1 uppercase tracking-wide">Careers</span>
        </Link>
        <div className="hidden md:flex gap-8">
          <a href="https://ekthaa.app" className="text-gray-600 hover:text-brand-teal text-sm font-medium">Home</a>
          <a href="https://ekthaa.app/about" className="text-gray-600 hover:text-brand-teal text-sm font-medium">About</a>
        </div>
      </div>
    </nav>
  )
}

// Shared Footer
function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Brand */}
          <div>
            <span className="font-serif text-2xl font-bold block mb-3">ekthaa</span>
            <p className="text-gray-400 text-sm leading-relaxed">Connecting you with the best local businesses and services in your community.</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Company</h4>
            <div className="space-y-2">
              <a href="https://ekthaa.app" className="block text-gray-400 hover:text-white text-sm transition-colors">Home</a>
              <a href="https://ekthaa.app/about" className="block text-gray-400 hover:text-white text-sm transition-colors">About Us</a>
              <a href="https://ekthaa.app/careers" className="block text-gray-400 hover:text-white text-sm transition-colors">Careers</a>
              <a href="https://ekthaa.app/products" className="block text-gray-400 hover:text-white text-sm transition-colors">Our Products</a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Support</h4>
            <div className="space-y-2">
              <a href="mailto:hr@ekthaa.app" className="block text-gray-400 hover:text-white text-sm transition-colors">Contact HR</a>
              <a href="mailto:support@ekthaa.app" className="block text-gray-400 hover:text-white text-sm transition-colors">General Support</a>
              <a href="https://ekthaa.app/delete-account" className="block text-gray-400 hover:text-white text-sm transition-colors">Delete Account</a>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="https://www.linkedin.com/company/ekthaa/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xl transition-colors">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://www.instagram.com/ekthaa.ai?utm_source=qr&igsh=MW1iNGU2ZG1lYWR6dg==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xl transition-colors">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
            <p className="text-gray-400 text-xs mb-3">Download the ekthaa App</p>
            <a href="https://play.google.com/store/apps/details?id=com.ekthaa.business" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 text-xs transition-colors">
              <i className="fa-brands fa-google-play text-base"></i>
              <span>Play Store</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2026 ekthaa. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://ekthaa.app/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="https://ekthaa.app/terms" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main App with Routing
function App() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch positions from new API
    axios.get('/api/positions')
      .then(res => {
        setPositions(Array.isArray(res.data) ? res.data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch positions:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PositionsPage positions={positions} />} />
        <Route path="/job/:slug" element={<JobDetailsPage positions={positions} />} />
        <Route path="/apply/:slug" element={<ApplyPage positions={positions} />} />
        <Route path="/success/:slug" element={<SuccessPage positions={positions} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App
