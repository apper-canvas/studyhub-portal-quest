import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import SelectField from "@/components/molecules/SelectField";
import { storage } from "@/utils/storage";
import { format } from "date-fns";

const EditAssignmentModal = ({ assignment, onClose, onSave, onDelete }) => {
  const courses = storage.getCourses();
  
  const [formData, setFormData] = useState({
    courseId: assignment.courseId,
    title: assignment.title,
    description: assignment.description || "",
    dueDate: format(new Date(assignment.dueDate), "yyyy-MM-dd"),
    priority: assignment.priority,
    status: assignment.status,
    totalPoints: assignment.totalPoints,
    earnedPoints: assignment.earnedPoints,
    completed: assignment.completed,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.courseId) newErrors.courseId = "Please select a course";
    if (!formData.title.trim()) newErrors.title = "Assignment title is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const assignments = storage.getAssignments();
    const updatedAssignments = assignments.map(a => 
      a.Id === assignment.Id ? { 
        ...a, 
        ...formData,
        earnedPoints: formData.earnedPoints ? parseFloat(formData.earnedPoints) : null,
        totalPoints: formData.totalPoints ? parseFloat(formData.totalPoints) : null,
      } : a
    );
    
    storage.setAssignments(updatedAssignments);
    toast.success("Assignment updated successfully!");
    onSave(assignment.Id, { ...assignment, ...formData });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      onDelete(assignment.Id);
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
            value={formData.courseId}
            onChange={(e) => handleChange("courseId", e.target.value)}
            error={errors.courseId}
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </SelectField>

          <FormField
            label="Assignment Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add notes about this assignment..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white text-gray-900"
            />
          </div>

          <FormField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            error={errors.dueDate}
          />

          <SelectField
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </SelectField>

          <SelectField
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
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
              value={formData.totalPoints || ""}
              onChange={(e) => handleChange("totalPoints", e.target.value)}
            />

            <FormField
              label="Earned Points (Optional)"
              type="number"
              step="0.1"
              min="0"
              value={formData.earnedPoints || ""}
              onChange={(e) => handleChange("earnedPoints", e.target.value)}
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