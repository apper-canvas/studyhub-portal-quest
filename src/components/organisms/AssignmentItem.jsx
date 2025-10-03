import { motion } from "framer-motion";
import React, { useState } from "react";
import { assignmentService } from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import EditAssignmentModal from "@/components/organisms/EditAssignmentModal";
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox";
import { formatDate, isDueSoon, isDueToday, isOverdue } from "@/utils/dateUtils";

const AssignmentItem = ({ assignment, courses, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const course = courses.find(c => c.Id === assignment.course_id_c?.Id || c.id_c === assignment.course_id_c?.Id);
  const handleToggleComplete = () => {
onUpdate(assignment.Id, { completed_c: !assignment.completed_c });
  };
  const getDateBadgeVariant = () => {
if (assignment.completed_c) return "success";
    if (isOverdue(assignment.due_date_c)) return "danger";
    if (isDueToday(assignment.due_date_c)) return "warning";
    if (isDueSoon(assignment.due_date_c)) return "info";
    return "default";
  };

  const getDateBadgeLabel = () => {
    if (assignment.completed_c) return "Completed";
    if (isOverdue(assignment.due_date_c)) return "Overdue";
    if (isDueToday(assignment.due_date_c)) return "Due Today";
    return formatDate(assignment.due_date_c);
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
<h3 className={`text-lg font-semibold ${assignment.completed_c ? "line-through text-gray-400" : "text-gray-900"}`}>
                  {assignment.title_c}
                </h3>
{assignment.description_c && (
                  <p className="text-sm text-gray-600 mt-1">{assignment.description_c}</p>
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
onClick={() => onDelete(assignment.Id)}
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
                  style={{ borderLeftColor: course.color_c }}
                >
                  {course.code_c}
                </Badge>
              )}
              <Badge variant={getDateBadgeVariant()}>
                <ApperIcon name="Calendar" size={12} className="mr-1" />
                {getDateBadgeLabel()}
              </Badge>
              <PriorityIndicator priority={assignment.priority_c} />
              {assignment.total_points_c !== null && (
                <Badge variant="info">
                  {assignment.earned_points_c !== null 
                    ? `${assignment.earned_points_c}/${assignment.total_points_c} pts`
                    : `${assignment.total_points_c} pts`
                  }
                </Badge>
              )}
            </div>
          </div>
        </div>
</div>
      </motion.div>

      {showEditModal && (
        <EditAssignmentModal
          assignment={assignment}
          courses={courses}
          onClose={() => setShowEditModal(false)}
          onSave={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default AssignmentItem;