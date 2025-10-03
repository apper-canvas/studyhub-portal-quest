import { motion } from "framer-motion";
import { useState } from "react";
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox";
import ApperIcon from "@/components/ApperIcon";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import { formatDate, isOverdue, isDueSoon, isDueToday } from "@/utils/dateUtils";
import EditAssignmentModal from "@/components/organisms/EditAssignmentModal";
import { storage } from "@/utils/storage";

const AssignmentItem = ({ assignment, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const courses = storage.getCourses();
  const course = courses.find(c => c.id === assignment.courseId);

  const handleToggleComplete = () => {
    onUpdate(assignment.id, { ...assignment, completed: !assignment.completed });
  };

  const getDateBadgeVariant = () => {
    if (assignment.completed) return "success";
    if (isOverdue(assignment.dueDate)) return "danger";
    if (isDueToday(assignment.dueDate)) return "warning";
    if (isDueSoon(assignment.dueDate)) return "info";
    return "default";
  };

  const getDateBadgeLabel = () => {
    if (assignment.completed) return "Completed";
    if (isOverdue(assignment.dueDate)) return "Overdue";
    if (isDueToday(assignment.dueDate)) return "Due Today";
    return formatDate(assignment.dueDate);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
      >
        <div className="flex items-start gap-4">
          <div className="pt-1">
            <Checkbox
              checked={assignment.completed}
              onChange={handleToggleComplete}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${assignment.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                  {assignment.title}
                </h3>
                {assignment.description && (
                  <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ApperIcon name="Edit2" size={16} />
                </button>
                <button
                  onClick={() => onDelete(assignment.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <ApperIcon name="Trash2" size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {course && (
                <Badge
                  className="border-l-4"
                  style={{ borderLeftColor: course.color }}
                >
                  {course.code}
                </Badge>
              )}
              <Badge variant={getDateBadgeVariant()}>
                <ApperIcon name="Calendar" size={12} className="mr-1" />
                {getDateBadgeLabel()}
              </Badge>
              <PriorityIndicator priority={assignment.priority} />
              {assignment.totalPoints !== null && (
                <Badge variant="info">
                  {assignment.earnedPoints !== null 
                    ? `${assignment.earnedPoints}/${assignment.totalPoints} pts`
                    : `${assignment.totalPoints} pts`
                  }
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {showEditModal && (
        <EditAssignmentModal
          assignment={assignment}
          onClose={() => setShowEditModal(false)}
          onSave={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default AssignmentItem;