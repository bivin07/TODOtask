import React from "react";

const baseClasses =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";

const Label = ({ text }) => (
  <label className="block mb-2 text-sm font-semibold text-gray-700">
    {text}
  </label>
);

export const TextInput = ({
  label,
  textarea = false,
  className = "",
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && <Label text={label} />}
      {textarea ? (
        <textarea className={`${baseClasses} ${className}`} {...props} />
      ) : (
        <input className={`${baseClasses} ${className}`} {...props} />
      )}
    </div>
  );
};

export const SelectInput = ({ label, children, className = "", ...props }) => (
  <div className="mb-4">
    {label && <Label text={label} />}
    <select className={`${baseClasses} ${className}`} {...props}>
      {children}
    </select>
  </div>
);

