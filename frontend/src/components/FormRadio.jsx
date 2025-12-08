import { motion } from 'framer-motion';

export default function FormRadio({ label, name, options, value, onChange, required }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      <label className="block text-sm font-medium text-gray-200">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
              className="w-4 h-4 text-accent bg-dark-bg border-dark-border focus:ring-2 focus:ring-accent focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-gray-300 group-hover:text-accent transition-colors">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </motion.div>
  );
}
