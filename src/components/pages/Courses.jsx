import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import CourseCard from "@/components/organisms/CourseCard";
import AddCourseModal from "@/components/organisms/AddCourseModal";
import Empty from "@/components/ui/Empty";
import { storage } from "@/utils/storage";
import { calculateCourseGrade } from "@/utils/calculations";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setCourses(storage.getCourses());
    setAssignments(storage.getAssignments());
  }, []);

  const handleAddCourse = (updatedCourses) => {
    setCourses(updatedCourses);
  };

  const handleUpdateCourse = (updatedCourses) => {
    setCourses(updatedCourses);
  };

  const handleDeleteCourse = (updatedCourses) => {
    setCourses(updatedCourses);
    setAssignments(storage.getAssignments());
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
            const courseAssignments = assignments.filter(a => a.courseId === course.id);
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