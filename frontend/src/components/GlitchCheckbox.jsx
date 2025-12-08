import { motion } from 'framer-motion';

export default function GlitchCheckbox({ label, name, options, values, onChange, required, hint }) {
  const handleCheckboxChange = (optionValue) => {
    const currentValues = values || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    
    onChange({
      target: {
        name,
        value: newValues,
        type: 'checkbox-group'
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      <label className="block text-sm font-medium text-gray-200">
        {label} {required && <span className="text-accent">*</span>}
        {hint && <div className="text-xs text-gray-400 font-normal mt-1">{hint}</div>}
      </label>
      <div className="glitch-checkbox-wrapper flex flex-col gap-4 bg-[#050505] p-4 rounded-lg">
        {options.map((option) => (
          <label
            key={option.value}
            className="glitch-checkbox-container flex items-center gap-3 cursor-pointer select-none relative group"
          >
            <input
              type="checkbox"
              name={`${name}[]`}
              value={option.value}
              checked={(values || []).includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="absolute opacity-0 w-0 h-0"
            />
            <div className="checkbox-box w-6 h-6 border-2 border-[#3b82f6] relative transition-all duration-300 group-hover:shadow-[0_0_10px_#3b82f6]"
              style={{
                clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)'
              }}
            >
              <div className={`checkbox-mark absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-[#3b82f6] transition-all duration-300 ${
                (values || []).includes(option.value) 
                  ? 'scale-100 opacity-100' 
                  : 'scale-0 opacity-0'
              }`}
                style={{
                  transform: `translate(-50%, -50%) ${(values || []).includes(option.value) ? 'scale(1)' : 'scale(0)'}`,
                  clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)'
                }}
              />
            </div>
            <span className={`checkbox-label text-[#e5e5e5] font-medium text-sm uppercase tracking-wider transition-all duration-300 ${
              (values || []).includes(option.value) ? 'text-[#3b82f6] [text-shadow:0_0_8px_rgba(59,130,246,0.7)]' : ''
            }`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </motion.div>
  );
}
