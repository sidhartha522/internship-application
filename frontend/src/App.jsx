import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FormInput from './components/FormInput';
import FormSelect from './components/FormSelect';
import FormTextarea from './components/FormTextarea';
import StarRating from './components/StarRating';
import ToggleRadio from './components/ToggleRadio';
import GlitchCheckbox from './components/GlitchCheckbox';
import FileUpload from './components/FileUpload';
import BackgroundBeams from './components/BackgroundBeams';
import AnimatedButton from './components/AnimatedButton';
import Toast from './components/Toast';
import StartButton from './components/StartButton';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    birthDate: '',
    position: '',
    skillLevel: '',
    availability: '',
    fullTimeCommit: '',
    employmentStatus: [],
    whyJoin: '',
    startDate: '',
    agree: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setResumeFile(files[0]);
    } else if (type === 'checkbox-group') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('linkedin', formData.linkedin);
      submitData.append('github', formData.github);
      submitData.append('birthDate', formData.birthDate);
      submitData.append('position', formData.position);
      submitData.append('skill', formData.skillLevel);
      submitData.append('availability', formData.availability);
      submitData.append('commit', formData.fullTimeCommit);
      submitData.append('employment', formData.employmentStatus.join(', '));
      submitData.append('why', formData.whyJoin);
      submitData.append('startDate', formData.startDate);
      submitData.append('agree', formData.agree);
      
      // Append resume file if exists
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      }

      await axios.post('/api/submit', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSubmitStatus({ type: 'success', message: 'Application submitted successfully!' });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        birthDate: '',
        position: '',
        skillLevel: '',
        availability: '',
        fullTimeCommit: '',
        employmentStatus: [],
        whyJoin: '',
        startDate: '',
        agree: ''
      });
      setResumeFile(null);
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to submit application' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundBeams />
      
      <AnimatePresence mode="wait">
        {!showForm ? (
          // Landing Page
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen flex items-center justify-center px-4"
          >
            <div className="max-w-3xl text-center space-y-8">
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold glow-text"
              >
                <span className="text-accent">Ekthaa</span> Developer Internship
              </motion.h1>
              
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed"
              >
                <p>
                  We are looking for motivated students who want to learn, build real features, 
                  and work in a practical development environment.
                </p>
                <p className="text-accent font-semibold text-2xl">
                  This is a remote, unpaid internship
                </p>
                <p>
                  with mentorship, structured tasks, and real project experience.
                </p>
              </motion.div>

              <StartButton onClick={() => setShowForm(true)} />
            </div>
          </motion.div>
        ) : (
          // Form Page
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 container mx-auto px-4 py-12 max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 glow-text">
                Join <span className="text-accent">Ekthaa</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Apply for an internship position and kickstart your career
              </p>
            </motion.div>

            <Toast
              message={submitStatus?.message}
              type={submitStatus?.type}
              onClose={() => setSubmitStatus(null)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Full Name */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput label="1. First Name" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First name" />
              <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last name" />
            </div>

            {/* 2. Email */}
            <FormInput 
              label="2. E-mail" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="yourname@gmail.com"
              hint="We'll contact you via this email."
            />

            {/* 3. Contact Number */}
            <FormInput 
              label="3. Contact Number" 
              name="phone" 
              type="tel" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              placeholder="+91 98765 43210" 
            />

            {/* 4. LinkedIn */}
            <FormInput 
              label="4. LinkedIn Profile URL" 
              name="linkedin" 
              type="url" 
              value={formData.linkedin} 
              onChange={handleChange} 
              required 
              placeholder="https://www.linkedin.com/in/yourname" 
            />

            {/* 5. GitHub */}
            <FormInput 
              label="5. GitHub Profile URL" 
              name="github" 
              type="url" 
              value={formData.github} 
              onChange={handleChange} 
              required 
              placeholder="https://github.com/username" 
            />

            {/* 6. Birth Date */}
            <FormInput 
              label="6. Birth Date" 
              name="birthDate" 
              type="date" 
              value={formData.birthDate} 
              onChange={handleChange} 
              required 
            />

            {/* 7. Position */}
            <FormSelect 
              label="7. What position are you applying for?" 
              name="position" 
              value={formData.position} 
              onChange={handleChange} 
              required 
              options={[
                { value: '', label: 'Select position' },
                { value: 'Backend Intern (Python + Flask)', label: 'Backend Intern (Python + Flask)' },
                { value: 'Frontend Intern (React Native)', label: 'Frontend Intern (React Native)' },
                { value: 'Full-Stack Intern (React Native + Python + Flask)', label: 'Full-Stack Intern (React Native + Python + Flask)' },
                { value: 'Database Engineering Intern (Firebase/Firestore)', label: 'Database Engineering Intern (Firebase/Firestore)' }
              ]}
            />

            {/* 8. Skill Level (Star Rating) */}
            <StarRating
              label="8. Rate your skill level (1–5)"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              required
            />

            {/* 9. Weekly Availability */}
            <FormSelect 
              label="9. Weekly Availability?" 
              name="availability" 
              value={formData.availability} 
              onChange={handleChange} 
              required 
              options={[
                { value: '', label: 'Select...' },
                { value: '5–10 hrs', label: '5–10 hrs' },
                { value: '10–15 hrs', label: '10–15 hrs' },
                { value: '15–20 hrs', label: '15–20 hrs' },
                { value: 'Depends on schedule', label: 'Depends on schedule' }
              ]}
            />

            {/* 10. Commitment (Toggle Yes/No) */}
            <ToggleRadio
              label="10. Can you commit for 1–2 months?"
              name="fullTimeCommit"
              value={formData.fullTimeCommit}
              onChange={handleChange}
              required
            />

            {/* 11. Employment Status (Glitch Checkboxes) */}
            <GlitchCheckbox
              label="11. What is your current employment status?"
              name="employmentStatus"
              values={formData.employmentStatus}
              onChange={handleChange}
              required
              options={[
                { value: 'Employed', label: 'EMPLOYED' },
                { value: 'Recently Graduated', label: 'RECENTLY_GRADUATED' },
                { value: 'Self-Employed', label: 'SELF_EMPLOYED' },
                { value: 'Student', label: 'STUDENT' },
                { value: 'Other', label: 'OTHER' }
              ]}
            />

            {/* 12. Resume Upload */}
            <FileUpload
              label="12. Upload Your Resume"
              name="resume"
              onChange={handleChange}
              required
              hint="Only PDF, DOC, DOCX, PPTX."
            />

            {/* 13. Why should we select you */}
            <FormTextarea 
              label="13. Why should we select you?" 
              name="whyJoin" 
              value={formData.whyJoin} 
              onChange={handleChange} 
              required 
              rows={6} 
              placeholder="Add anything else you'd like us to know"
            />

            {/* 14. Start Date */}
            <FormInput 
              label="14. Available start date" 
              name="startDate" 
              type="date" 
              value={formData.startDate} 
              onChange={handleChange} 
              required 
            />

            {/* 15. Unpaid Internship Agreement (Toggle Yes/No) */}
            <ToggleRadio
              label="15. Do you agree this is an unpaid internship?"
              name="agree"
              value={formData.agree}
              onChange={handleChange}
              required
            />

            <AnimatedButton type="submit" isLoading={isSubmitting}>
              Submit Application
            </AnimatedButton>
          </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
