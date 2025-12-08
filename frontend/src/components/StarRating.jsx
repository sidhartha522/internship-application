import { motion } from 'framer-motion';

export default function StarRating({ label, name, value, onChange, required }) {
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
      <div className="star-rating flex gap-1" style={{ position: 'relative', zIndex: 10 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star} className="cursor-pointer relative" htmlFor={`${name}-star${star}`} style={{ zIndex: 10 }}>
            <input
              type="radio"
              id={`${name}-star${star}`}
              name={name}
              value={star}
              checked={value === String(star)}
              onChange={onChange}
              required={required}
              className="absolute opacity-0 w-0 h-0"
              style={{ pointerEvents: 'none' }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30px"
              viewBox="0 0 576 512"
              className="transition-all duration-300 cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <path
                d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
              />
            </svg>
          </label>
        ))}
      </div>
      <style>{`
        .star-rating svg {
          fill: #666;
        }
        
        .star-rating:has(input[value="5"]:checked) label[for$="star5"] svg,
        .star-rating:has(input[value="5"]:checked) label[for$="star4"] svg,
        .star-rating:has(input[value="5"]:checked) label[for$="star3"] svg,
        .star-rating:has(input[value="5"]:checked) label[for$="star2"] svg,
        .star-rating:has(input[value="5"]:checked) label[for$="star1"] svg {
          fill: #ab68ff;
        }
        
        .star-rating:has(input[value="4"]:checked) label[for$="star4"] svg,
        .star-rating:has(input[value="4"]:checked) label[for$="star3"] svg,
        .star-rating:has(input[value="4"]:checked) label[for$="star2"] svg,
        .star-rating:has(input[value="4"]:checked) label[for$="star1"] svg {
          fill: #19c37d;
        }
        
        .star-rating:has(input[value="3"]:checked) label[for$="star3"] svg,
        .star-rating:has(input[value="3"]:checked) label[for$="star2"] svg,
        .star-rating:has(input[value="3"]:checked) label[for$="star1"] svg {
          fill: #eab308;
        }
        
        .star-rating:has(input[value="2"]:checked) label[for$="star2"] svg,
        .star-rating:has(input[value="2"]:checked) label[for$="star1"] svg {
          fill: #e06c2b;
        }
        
        .star-rating:has(input[value="1"]:checked) label[for$="star1"] svg {
          fill: #ef4444;
        }
        
        .star-rating:not(:has(input:checked)) label:hover svg,
        .star-rating:not(:has(input:checked)) label:hover ~ label svg {
          fill: #ff9e0b;
        }
      `}</style>
    </motion.div>
  );
}
