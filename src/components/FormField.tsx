import React from 'react';

type FormFieldProps = {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: 'number' | 'select' | 'text';
  options?: string[];
};

const FormField: React.FC<FormFieldProps> = ({ label, value, onChange, type = 'number', options = [] }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="font-medium">{label}</label>
      {type === 'select' ? (
        <select value={value} onChange={onChange} className="form-control p-2 border rounded">
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="form-control p-2 border rounded"
        />
      )}
    </div>
  );
};

export default FormField;
