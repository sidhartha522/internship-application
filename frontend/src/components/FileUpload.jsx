import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FileUpload({ label, name, onChange, required, hint }) {
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(e);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      // Create a synthetic event to pass to onChange
      const input = document.getElementById(name);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      onChange({ target: input });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-200">
        {label} {required && <span className="text-accent">*</span>}
        {hint && <div className="text-xs text-gray-400 font-normal mt-1">{hint}</div>}
      </label>
      
      <label 
        htmlFor={name}
        className={`file-upload-label cursor-pointer bg-[#333] p-8 rounded-3xl border-2 border-dashed transition-all duration-300 block ${
          isDragging ? 'border-accent bg-accent/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-[#666] hover:border-accent hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="file-upload-design flex flex-col items-center justify-center gap-2 text-[#eee]">
          <svg viewBox="0 0 640 512" className="h-12 fill-[#666] mb-3">
            <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
          </svg>
          <p className="text-base">Drag and Drop</p>
          <p className="text-sm text-gray-400">or</p>
          <span className="browse-button bg-[#666] px-4 py-2 rounded-lg text-[#eee] transition-all duration-300 hover:bg-[#888] hover:text-white">
            Browse file
          </span>
          {fileName && (
            <p className="text-sm text-accent mt-3 font-medium">Selected: {fileName}</p>
          )}
        </div>
        <input 
          id={name}
          name={name}
          type="file" 
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={handleFileChange}
          required={required}
          className="hidden"
        />
      </label>
    </motion.div>
  );
}
