import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Assignments from "@/components/pages/Assignments";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import { formatDate } from "@/utils/dateUtils";
import { calculateCourseGrade, gradeToLetter } from "@/utils/calculations";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);

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
        title="No courses to grade"
        description="Add courses and assignments with grades to see your academic performance."
        icon="Award"
        action={() => window.location.href = "/courses"}
        actionLabel="Go to Courses"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grades</h1>
        <p className="text-gray-600">View your performance across all courses</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
{courses.map((course) => {
          const courseAssignments = assignments.filter(a => 
            a.course_id_c?.Id === course.Id || a.course_id_c?.Id === course.id_c
          );
          const gradedAssignments = courseAssignments.filter(a => 
            a.earned_points_c !== null && a.total_points_c !== null
          );
          const grade = calculateCourseGrade(courseAssignments);
          const letterGrade = grade !== null ? gradeToLetter(grade) : "N/A";
          const isExpanded = expandedCourse === course.Id;

          return (
            <motion.div key={course.Id} variants={item}>
              <Card className="overflow-hidden">
                <button
                  onClick={() => setExpandedCourse(isExpanded ? null : course.Id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2 h-16 rounded-full"
                      style={{ backgroundColor: course.color_c }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{course.code_c}</h3>
                      <p className="text-sm text-gray-600">{course.name_c}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="primary">{course.credits_c} Credits</Badge>
                        <Badge variant="info">
                          {gradedAssignments.length} of {courseAssignments.length} Graded
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="text-4xl font-bold text-gray-900">{letterGrade}</div>
                      <div className="text-sm text-gray-500">
                        {grade !== null ? `${grade.toFixed(1)}%` : "No grades"}
                      </div>
                    </div>
                    <ApperIcon
                      name={isExpanded ? "ChevronUp" : "ChevronDown"}
                      size={24}
                      className="text-gray-400"
                    />
                  </div>
                </button>

                {isExpanded && gradedAssignments.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <h4 className="font-semibold text-gray-900 mb-4">Graded Assignments</h4>
                    <div className="space-y-3">
                      {gradedAssignments.map((assignment) => {
                        const percentage = (assignment.earned_points_c / assignment.total_points_c) * 100;
                        const assignmentGrade = gradeToLetter(percentage);

                        return (
                          <div
                            key={assignment.Id}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{assignment.title_c}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Due: {formatDate(assignment.due_date_c)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    {assignment.earned_points_c} / {assignment.total_points_c} pts
                                  </p>
                                  <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                                </div>
                                <Badge
                                  variant={
                                    percentage >= 90 ? "success" :
                                    percentage >= 80 ? "info" :
                                    percentage >= 70 ? "warning" :
                                    "danger"
                                  }
                                  className="text-lg px-3 py-1"
                                >
                                  {assignmentGrade}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {isExpanded && gradedAssignments.length === 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <ApperIcon name="FileText" size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600">No graded assignments yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Add grades to assignments to see them here
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Grades;