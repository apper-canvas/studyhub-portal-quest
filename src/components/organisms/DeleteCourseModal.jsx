import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { storage } from "@/utils/storage";

const DeleteCourseModal = ({ course, onClose, onConfirm }) => {
  const assignments = storage.getAssignments();
  const affectedAssignments = assignments.filter(a => a.courseId === course.id);

  const handleDelete = () => {
    const courses = storage.getCourses();
    const updatedCourses = courses.filter(c => c.Id !== course.Id);
    storage.setCourses(updatedCourses);

    const updatedAssignments = assignments.filter(a => a.courseId !== course.id);
    storage.setAssignments(updatedAssignments);

    toast.success("Course deleted successfully!");
    onConfirm(updatedCourses);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Delete Course</h2>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">
              Deleting <span className="font-semibold">{course.code} - {course.name}</span> will also delete:
            </p>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-red-700 flex items-center gap-2">
                <ApperIcon name="AlertCircle" size={14} />
                {affectedAssignments.length} assignment{affectedAssignments.length !== 1 ? "s" : ""}
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              <ApperIcon name="Trash2" size={18} className="mr-2" />
              Delete Course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseModal;