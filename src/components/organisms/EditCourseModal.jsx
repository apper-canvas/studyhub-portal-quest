import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import ColorPicker from "@/components/molecules/ColorPicker";

const EditCourseModal = ({ course, onClose, onSave }) => {
const [formData, setFormData] = useState({
    code_c: course.code_c,
    name_c: course.name_c,
    instructor_c: course.instructor_c,
    credits_c: course.credits_c,
    color_c: course.color_c,
  });

  const [errors, setErrors] = useState({});

const validate = () => {
    const newErrors = {};
    if (!formData.code_c.trim()) newErrors.code_c = "Course code is required";
    if (!formData.name_c.trim()) newErrors.name_c = "Course name is required";
    if (!formData.instructor_c.trim()) newErrors.instructor_c = "Instructor name is required";
    if (formData.credits_c < 1 || formData.credits_c > 6) newErrors.credits_c = "Credits must be between 1 and 6";
    return newErrors;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave(course.Id, formData);
    onClose();
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
          <h2 className="text-xl font-bold text-gray-900">Edit Course</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
<FormField
            label="Course Code"
            value={formData.code_c}
            onChange={(e) => handleChange("code_c", e.target.value)}
            error={errors.code_c}
          />

<FormField
            label="Course Name"
            value={formData.name_c}
            onChange={(e) => handleChange("name_c", e.target.value)}
            error={errors.name_c}
          />

<FormField
            label="Instructor"
            value={formData.instructor_c}
            onChange={(e) => handleChange("instructor_c", e.target.value)}
            error={errors.instructor_c}
          />

<FormField
            label="Credits"
            type="number"
            min="1"
            max="6"
            value={formData.credits_c}
            onChange={(e) => handleChange("credits_c", parseInt(e.target.value))}
            error={errors.credits_c}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Color
            </label>
<ColorPicker
              value={formData.color_c}
              onChange={(color) => handleChange("color_c", color)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <ApperIcon name="Save" size={18} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;