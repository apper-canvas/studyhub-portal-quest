import { motion } from "framer-motion";
import { useState } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { gradeToLetter } from "@/utils/calculations";
import EditCourseModal from "@/components/organisms/EditCourseModal";
import DeleteCourseModal from "@/components/organisms/DeleteCourseModal";

const CourseCard = ({ course, grade, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const gradeDisplay = grade !== null ? `${grade.toFixed(1)}%` : "N/A";
  const letterGrade = grade !== null ? gradeToLetter(grade) : "N/A";

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: course.color }}
          />
          
          <div className="pl-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{course.code}</h3>
                <p className="text-sm text-gray-600">{course.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ApperIcon name="Edit2" size={16} />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <ApperIcon name="Trash2" size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <ApperIcon name="User" size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{course.instructor}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Badge variant="primary">{course.credits} Credits</Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{letterGrade}</div>
                <div className="text-sm text-gray-500">{gradeDisplay}</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {showEditModal && (
        <EditCourseModal
          course={course}
          onClose={() => setShowEditModal(false)}
          onSave={onUpdate}
        />
      )}

      {showDeleteModal && (
        <DeleteCourseModal
          course={course}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={onDelete}
        />
      )}
    </>
  );
};

export default CourseCard;