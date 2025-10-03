import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Assignments from "@/components/pages/Assignments";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { formatDateShort, getOverdueAssignments, getUpcomingAssignments } from "@/utils/dateUtils";
import { calculateCourseGrade, calculateGPA, gradeToLetter } from "@/utils/calculations";

const Dashboard = () => {
  const navigate = useNavigate();
const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAllCourses(),
        assignmentService.getAllAssignments()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
      setLoading(false);
    };
    loadData();
  }, []);

const gpa = calculateGPA(courses, assignments);
  const upcomingAssignments = getUpcomingAssignments(assignments, 7);
  const overdueAssignments = getOverdueAssignments(assignments);
  const totalCredits = courses.reduce((sum, c) => sum + (c.credits_c || 0), 0);

const handleToggleComplete = async (assignmentId) => {
    const assignment = assignments.find(a => a.Id === assignmentId);
    if (!assignment) return;

    const updatedAssignment = await assignmentService.updateRecords(assignmentId, {
      completed_c: !assignment.completed_c
    });

    if (updatedAssignment) {
      const updatedAssignments = assignments.map(a =>
        a.Id === assignmentId ? { ...a, completed_c: !a.completed_c } : a
      );
      setAssignments(updatedAssignments);
    }
  };

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
                  const course = courses.find(c => c.id_c === assignment.course_id_c?.Id || c.Id === assignment.course_id_c?.Id);
                  return (
                    <div
                      key={assignment.Id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={assignment.completed_c}
                        onChange={() => handleToggleComplete(assignment.Id)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-gray-900 truncate ${assignment.completed_c ? "line-through text-gray-400" : ""}`}>
                          {assignment.title_c}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {course && (
                            <Badge
                              className="border-l-4"
                              style={{ borderLeftColor: course.color_c }}
                            >
                              {course.code_c}
                            </Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            {formatDateShort(assignment.due_date_c)}
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
                const courseAssignments = assignments.filter(a => 
                  a.course_id_c?.Id === course.Id || a.course_id_c?.Id === course.id_c
                );
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
                      style={{ backgroundColor: course.color_c }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{course.code_c}</p>
                      <p className="text-sm text-gray-600 truncate">{course.name_c}</p>
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