import React, { useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import SelectField from "@/components/molecules/SelectField";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const EditAssignmentModal = ({ assignment, courses, onClose, onSave, onDelete }) => {
  
const [formData, setFormData] = useState({
    course_id_c: assignment.course_id_c?.Id || assignment.course_id_c,
    title_c: assignment.title_c,
    description_c: assignment.description_c || "",
    due_date_c: format(new Date(assignment.due_date_c), "yyyy-MM-dd"),
    priority_c: assignment.priority_c,
    status_c: assignment.status_c,
    total_points_c: assignment.total_points_c,
    earned_points_c: assignment.earned_points_c,
    completed_c: assignment.completed_c,
  });

  const [errors, setErrors] = useState({});

const validate = () => {
    const newErrors = {};
    if (!formData.course_id_c) newErrors.course_id_c = "Please select a course";
    if (!formData.title_c.trim()) newErrors.title_c = "Assignment title is required";
    if (!formData.due_date_c) newErrors.due_date_c = "Due date is required";
    return newErrors;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave(assignment.Id, formData);
    onClose();
  };

const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      await onDelete(assignment.Id);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Assignment</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
<SelectField
            label="Course"
            value={formData.course_id_c}
            onChange={(e) => handleChange("course_id_c", e.target.value)}
            error={errors.course_id_c}
          >
{courses.map(course => (
              <option key={course.Id} value={course.Id}>
                {course.code_c} - {course.name_c}
              </option>
            ))}
          </SelectField>

<FormField
            label="Assignment Title"
            value={formData.title_c}
            onChange={(e) => handleChange("title_c", e.target.value)}
            error={errors.title_c}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (Optional)</label>
<textarea
              value={formData.description_c}
onChange={(e) => handleChange("description_c", e.target.value)}
              placeholder="Add notes about this assignment..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white text-gray-900"
            />
          </div>
<FormField
            label="Due Date"
            type="date"
            value={formData.due_date_c}
            onChange={(e) => handleChange("due_date_c", e.target.value)}
            error={errors.due_date_c}
          />

          <SelectField
            label="Priority"
            value={formData.priority_c}
            onChange={(e) => handleChange("priority_c", e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </SelectField>

          <SelectField
            label="Status"
            value={formData.status_c}
            onChange={(e) => handleChange("status_c", e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </SelectField>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Total Points (Optional)"
              type="number"
              step="0.1"
min="0"
              value={formData.total_points_c || ""}
              onChange={(e) => handleChange("total_points_c", e.target.value)}
            />

            <FormField
              label="Earned Points (Optional)"
              type="number"
              step="0.1"
min="0"
              value={formData.earned_points_c || ""}
              onChange={(e) => handleChange("earned_points_c", e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="danger" onClick={handleDelete} className="flex-1">
              <ApperIcon name="Trash2" size={18} className="mr-2" />
              Delete
            </Button>
            <Button type="submit" className="flex-1">
              <ApperIcon name="Save" size={18} className="mr-2" />
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssignmentModal;