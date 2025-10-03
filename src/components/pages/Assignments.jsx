import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import AssignmentItem from "@/components/organisms/AssignmentItem";
import AddAssignmentModal from "@/components/organisms/AddAssignmentModal";
import Empty from "@/components/ui/Empty";
import { storage } from "@/utils/storage";
import { isOverdue } from "@/utils/dateUtils";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    setAssignments(storage.getAssignments());
    setCourses(storage.getCourses());
  }, []);

  const handleAddAssignment = (updatedAssignments) => {
    setAssignments(updatedAssignments);
  };

  const handleUpdateAssignment = (id, updatedData) => {
    const updatedAssignments = assignments.map(a =>
      a.Id === id ? { ...a, ...updatedData } : a
    );
    storage.setAssignments(updatedAssignments);
    setAssignments(updatedAssignments);
  };

  const handleDeleteAssignment = (id) => {
    const updatedAssignments = assignments.filter(a => a.Id !== id);
    storage.setAssignments(updatedAssignments);
    setAssignments(updatedAssignments);
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filterCourse !== "all" && assignment.courseId !== filterCourse) return false;
    if (filterStatus !== "all") {
      if (filterStatus === "completed" && !assignment.completed) return false;
      if (filterStatus === "pending" && assignment.completed) return false;
      if (filterStatus === "overdue" && (!isOverdue(assignment.dueDate) || assignment.completed)) return false;
    }
    if (filterPriority !== "all" && assignment.priority !== filterPriority) return false;
    return true;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  if (courses.length === 0) {
    return (
      <Empty
        title="Add courses first"
        description="You need to add courses before creating assignments. Start by adding your courses."
        icon="BookOpen"
        action={() => window.location.href = "/courses"}
        actionLabel="Go to Courses"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
          <p className="text-gray-600">Track and manage your coursework</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Assignment
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Filter by Course</label>
            <Select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Filter by Status</label>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Filter by Priority</label>
            <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>
        </div>
      </div>

      {sortedAssignments.length === 0 ? (
        <Empty
          title={assignments.length === 0 ? "No assignments yet" : "No matching assignments"}
          description={assignments.length === 0 
            ? "Create your first assignment to start tracking your coursework."
            : "Try adjusting your filters to see more assignments."
          }
          icon="CheckSquare"
          action={assignments.length === 0 ? () => setShowAddModal(true) : undefined}
          actionLabel="Add Assignment"
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sortedAssignments.map((assignment) => (
              <AssignmentItem
                key={assignment.Id}
                assignment={assignment}
                onUpdate={handleUpdateAssignment}
                onDelete={handleDeleteAssignment}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {showAddModal && (
        <AddAssignmentModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddAssignment}
        />
      )}
    </div>
  );
};

export default Assignments;