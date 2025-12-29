'use client';

import { CATEGORY_LIST, CategoryKey } from '@/lib/constants/category';

interface CategorySelectProps {
  value: CategoryKey;
  onChange: (category: CategoryKey) => void;
  error?: string;
}

export default function CategorySelect({ value, onChange, error }: CategorySelectProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_LIST.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onChange(cat.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              value === cat.key
                ? 'text-white'
                : 'bg-[#272729] text-[#818384] hover:text-[#d7dadc]'
            }`}
            style={value === cat.key ? { backgroundColor: cat.color } : undefined}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}
