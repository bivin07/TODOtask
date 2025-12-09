import React, { useEffect, useState } from "react";
import Button from "./ui/Button.js";
import { TextInput, SelectInput } from "./ui/Input.js";

const defaultData = {
  title: "",
  description: "",
  status: "pending",
};

const TodoForm = ({
  initialData = defaultData,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  loading = false,
}) => {
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    setFormData({
      ...defaultData,
      ...initialData,
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <TextInput
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., Buy groceries"
        required
      />

      <TextInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        textarea
        rows="4"
        placeholder="Optional details..."
      />

      <SelectInput
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </SelectInput>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TodoForm;

