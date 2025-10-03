import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import AddCourseModal from "@/components/organisms/AddCourseModal";
import CourseCard from "@/components/organisms/CourseCard";
import Button from "@/components/atoms/Button";
import { calculateCourseGrade } from "@/utils/calculations";

const Courses = () => {
const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

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

const handleAddCourse = async (courseData) => {
    const newCourse = await courseService.createRecords(courseData);
    if (newCourse) {
      setCourses([...courses, newCourse]);
    }
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    const updated = await courseService.updateRecords(courseId, courseData);
    if (updated) {
      const updatedCourses = courses.map(c => c.Id === courseId ? updated : c);
      setCourses(updatedCourses);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const success = await courseService.deleteRecords(courseId);
    if (success) {
      setCourses(courses.filter(c => c.Id !== courseId));
      const assignmentsData = await assignmentService.getAllAssignments();
      setAssignments(assignmentsData);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
          <p className="text-gray-600">Manage your enrolled courses and track progress</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Course
        </Button>
      </div>

{courses.length === 0 ? (
        <Empty
          title="No courses yet"
          description="Add your first course to start tracking your academic progress and assignments."
          icon="BookOpen"
          action={() => setShowAddModal(true)}
          actionLabel="Add Course"
        />
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {courses.map((course) => {
            const courseAssignments = assignments.filter(a => 
              a.course_id_c?.Id === course.Id || a.course_id_c?.Id === course.id_c
            );
            const grade = calculateCourseGrade(courseAssignments);
            
            return (
              <motion.div key={course.Id} variants={item}>
                <CourseCard
                  course={course}
                  grade={grade}
                  onUpdate={handleUpdateCourse}
                  onDelete={handleDeleteCourse}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}

{showAddModal && (
        <AddCourseModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCourse}
        />
      )}
</div>
  );
};

export default Courses;