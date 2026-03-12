
import React from 'react';
import { Measurements } from '../types';
import { MEASUREMENT_LABELS } from '../constants';

interface AbayaDiagramProps {
  measurements: Measurements;
  onChange: (key: keyof Measurements, value: string) => void;
  readOnly?: boolean;
}

const AbayaDiagram: React.FC<AbayaDiagramProps> = ({ measurements, onChange, readOnly }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto bg-pink-50/30 rounded-3xl p-4 md:p-8 border border-pink-100 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-pink-800">المقاسات — Measurements</h3>
        <span className="text-xs text-pink-400 italic">الوحدة: CM</span>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {MEASUREMENT_LABELS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-[11px] md:text-xs text-gray-500">
              <span className="font-bold text-gray-700 block">{field.ar}</span>
              <span className="italic block opacity-70">{field.en}</span>
            </label>
            <input
              type="text"
              placeholder="0.0"
              readOnly={readOnly}
              value={measurements[field.key as keyof Measurements]}
              onChange={(e) => onChange(field.key as keyof Measurements, e.target.value)}
              className="w-full bg-white border border-pink-100 rounded-lg px-3 py-2 text-center text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-shadow"
            />
          </div>
        ))}
      </div>

      <div className="mt-10 opacity-20 pointer-events-none select-none flex justify-center">
        <svg viewBox="0 0 200 240" className="w-48 h-auto text-pink-800 fill-current">
          <path d="M100 20 L60 40 L40 220 L160 220 L140 40 Z" />
          <path d="M60 40 L10 100 L25 110 L60 60" />
          <path d="M140 40 L190 100 L175 110 L140 60" />
        </svg>
      </div>
    </div>
  );
};

export default AbayaDiagram;
