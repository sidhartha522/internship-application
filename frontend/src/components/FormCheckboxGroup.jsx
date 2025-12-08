import { motion } from 'framer-motion';

export default function FormCheckboxGroup({ label, name, options, values, onChange, required, hint }) {
  const handleCheckboxChange = (optionValue) => {
    const currentValues = values || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    
    // Create synthetic event for parent handler
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
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-lg hover:bg-dark-bg/50 transition-colors"
          >
            <input
              type="checkbox"
              name={`${name}[]`}
              value={option.value}
              checked={(values || []).includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="w-4 h-4 rounded text-accent bg-dark-bg border-dark-border focus:ring-2 focus:ring-accent focus:ring-offset-0 cursor-pointer"
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
