import { toast } from "react-toastify";
import { assignmentService } from "@/services/api/assignmentService";
import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";

const DeleteCourseModal = ({ course, onClose, onConfirm }) => {
  const [assignments, setAssignments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadAssignments = async () => {
      const data = await assignmentService.getAllAssignments();
      setAssignments(data);
      setLoading(false);
    };
    loadAssignments();
  }, []);

  const affectedAssignments = assignments.filter(a => 
    a.course_id_c?.Id === course.Id || a.course_id_c?.Id === course.id_c
  );

  const handleDelete = async () => {
    const assignmentIds = affectedAssignments.map(a => a.Id);
    if (assignmentIds.length > 0) {
      await assignmentService.deleteRecords(assignmentIds);
    }
    
    await onConfirm(course.Id);
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

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
              Deleting <span className="font-semibold">{course.code_c} - {course.name_c}</span> will also delete:
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