import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import { storage } from "@/utils/storage";
import { calculateGPA, calculateCourseGrade, gradeToLetter } from "@/utils/calculations";
import { getUpcomingAssignments, getOverdueAssignments, formatDateShort } from "@/utils/dateUtils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    setCourses(storage.getCourses());
    setAssignments(storage.getAssignments());
  }, []);

  const gpa = calculateGPA(courses, assignments);
  const upcomingAssignments = getUpcomingAssignments(assignments, 7);
  const overdueAssignments = getOverdueAssignments(assignments);
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  const handleToggleComplete = (assignmentId) => {
    const updatedAssignments = assignments.map(a =>
      a.Id === assignmentId ? { ...a, completed: !a.completed } : a
    );
    storage.setAssignments(updatedAssignments);
    setAssignments(updatedAssignments);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (courses.length === 0) {
    return (
      <Empty
        title="Welcome to StudyHub!"
        description="Start by adding your courses to begin tracking your academic progress."
        icon="GraduationCap"
        action={() => navigate("/courses")}
        actionLabel="Add Your First Course"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Your academic overview at a glance</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={item}>
          <StatCard
            title="Current GPA"
            value={gpa !== null ? gpa.toFixed(2) : "N/A"}
            icon="Award"
            color="primary"
            subtitle={gpa !== null ? "Out of 4.0" : "Add grades to calculate"}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            title="Active Courses"
            value={courses.length}
            icon="BookOpen"
            color="secondary"
            subtitle={`${totalCredits} total credits`}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            title="Upcoming"
            value={upcomingAssignments.length}
            icon="Calendar"
            color="accent"
            subtitle="Next 7 days"
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            title="Overdue"
            value={overdueAssignments.length}
            icon="AlertCircle"
            color="danger"
            subtitle={overdueAssignments.length === 0 ? "All caught up!" : "Needs attention"}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/assignments")}>
                View All
                <ApperIcon name="ChevronRight" size={16} className="ml-1" />
              </Button>
            </div>

            {upcomingAssignments.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-3" />
                <p className="text-gray-600">No upcoming assignments</p>
                <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.slice(0, 5).map((assignment) => {
                  const course = courses.find(c => c.id === assignment.courseId);
                  return (
                    <div
                      key={assignment.Id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={assignment.completed}
                        onChange={() => handleToggleComplete(assignment.Id)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-gray-900 truncate ${assignment.completed ? "line-through text-gray-400" : ""}`}>
                          {assignment.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {course && (
                            <Badge
                              className="border-l-4"
                              style={{ borderLeftColor: course.color }}
                            >
                              {course.code}
                            </Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            {formatDateShort(assignment.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Course Overview</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/courses")}>
                Manage
                <ApperIcon name="ChevronRight" size={16} className="ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {courses.slice(0, 5).map((course) => {
                const courseAssignments = assignments.filter(a => a.courseId === course.id);
                const grade = calculateCourseGrade(courseAssignments);
                const letterGrade = grade !== null ? gradeToLetter(grade) : "N/A";

                return (
                  <div
                    key={course.Id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate("/grades")}
                  >
                    <div
                      className="w-2 h-12 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{course.code}</p>
                      <p className="text-sm text-gray-600 truncate">{course.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{letterGrade}</p>
                      <p className="text-xs text-gray-500">
                        {grade !== null ? `${grade.toFixed(1)}%` : "No grades"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {overdueAssignments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-l-4 border-red-500">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Overdue Assignments</h3>
                <p className="text-gray-600 mb-4">
                  You have {overdueAssignments.length} overdue assignment{overdueAssignments.length !== 1 ? "s" : ""} that need attention.
                </p>
                <Button variant="danger" size="sm" onClick={() => navigate("/assignments")}>
                  Review Now
                  <ApperIcon name="ChevronRight" size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;