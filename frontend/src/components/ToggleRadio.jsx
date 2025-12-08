import { motion } from 'framer-motion';

export default function ToggleRadio({ label, name, value, onChange, required }) {
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
      <div className="toggle-dial flex gap-3">
        <label className="toggle-yes cursor-pointer">
          <input
            type="radio"
            name={name}
            value="Yes"
            checked={value === 'Yes'}
            onChange={onChange}
            required={required}
            className="hidden"
          />
          <div className="toggle-button w-16 h-8 bg-[#111] text-white border-2 border-green-500 shadow-[0_4px_#0a0,0_8px_#050] text-sm font-medium text-center leading-8 rounded-lg transition-all duration-200 hover:brightness-110">
            Yes
          </div>
        </label>
        <label className="toggle-no cursor-pointer">
          <input
            type="radio"
            name={name}
            value="No"
            checked={value === 'No'}
            onChange={onChange}
            className="hidden"
          />
          <div className="toggle-button w-16 h-8 bg-[#111] text-white border-2 border-red-500 shadow-[0_4px_#900,0_8px_#600] text-sm font-medium text-center leading-8 rounded-lg transition-all duration-200 hover:brightness-110">
            No
          </div>
        </label>
      </div>
      <style>{`
        .toggle-yes input:checked + .toggle-button {
          background: rgb(86, 235, 0);
          color: #000;
          box-shadow: 0 4px rgb(5, 153, 0), 0 8px rgb(17, 102, 0);
          transform: translateY(2px);
          border-color: rgb(144, 255, 144);
        }
        .toggle-no input:checked + .toggle-button {
          background: #ef4444;
          box-shadow: 0 4px #991b1b, 0 8px #7f1d1d;
          color: white;
          border-color: rgb(255, 138, 138);
        }
      `}</style>
    </motion.div>
  );
}
