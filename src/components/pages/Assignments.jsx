import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Courses from "@/components/pages/Courses";
import AddAssignmentModal from "@/components/organisms/AddAssignmentModal";
import AssignmentItem from "@/components/organisms/AssignmentItem";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { isOverdue } from "@/utils/dateUtils";

const Assignments = () => {
const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAllAssignments(),
        courseService.getAllCourses()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
      setLoading(false);
    };
    loadData();
  }, []);

const handleAddAssignment = async (assignmentData) => {
    const newAssignment = await assignmentService.createRecords(assignmentData);
    if (newAssignment) {
      setAssignments([...assignments, newAssignment]);
    }
  };

  const handleUpdateAssignment = async (id, updatedData) => {
    const updated = await assignmentService.updateRecords(id, updatedData);
    if (updated) {
      const updatedAssignments = assignments.map(a =>
        a.Id === id ? { ...a, ...updated } : a
      );
      setAssignments(updatedAssignments);
    }
  };

  const handleDeleteAssignment = async (id) => {
    const success = await assignmentService.deleteRecords(id);
    if (success) {
      setAssignments(assignments.filter(a => a.Id !== id));
    }
  };

const filteredAssignments = assignments.filter(assignment => {
    const courseIdMatch = assignment.course_id_c?.Id;
    if (filterCourse !== "all" && courseIdMatch && courseIdMatch.toString() !== filterCourse) return false;
    if (filterStatus !== "all") {
      if (filterStatus === "completed" && !assignment.completed_c) return false;
      if (filterStatus === "pending" && assignment.completed_c) return false;
      if (filterStatus === "overdue" && (!isOverdue(assignment.due_date_c) || assignment.completed_c)) return false;
    }
    if (filterPriority !== "all" && assignment.priority_c !== filterPriority) return false;
    return true;
  });
const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (a.completed_c !== b.completed_c) return a.completed_c ? 1 : -1;
    return new Date(a.due_date_c) - new Date(b.due_date_c);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
</div>
      </div>
    );
  }
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
                <option key={course.Id} value={course.Id}>
                  {course.code_c} - {course.name_c}
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
                courses={courses}
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
          courses={courses}
        />
      )}
    </div>
  );
};

export default Assignments;