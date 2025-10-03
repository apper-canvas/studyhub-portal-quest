import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import { storage } from "@/utils/storage";
import { calculateCourseGrade, gradeToLetter } from "@/utils/calculations";
import { formatDate } from "@/utils/dateUtils";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    setCourses(storage.getCourses());
    setAssignments(storage.getAssignments());
  }, []);

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
          const courseAssignments = assignments.filter(a => a.courseId === course.id);
          const gradedAssignments = courseAssignments.filter(a => 
            a.earnedPoints !== null && a.totalPoints !== null
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
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{course.code}</h3>
                      <p className="text-sm text-gray-600">{course.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="primary">{course.credits} Credits</Badge>
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
                        const percentage = (assignment.earnedPoints / assignment.totalPoints) * 100;
                        const assignmentGrade = gradeToLetter(percentage);

                        return (
                          <div
                            key={assignment.Id}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{assignment.title}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Due: {formatDate(assignment.dueDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    {assignment.earnedPoints} / {assignment.totalPoints} pts
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