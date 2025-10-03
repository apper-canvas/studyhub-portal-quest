export const calculateCourseGrade = (assignments) => {
  if (!assignments || assignments.length === 0) return null;
  
  const gradedAssignments = assignments.filter(
    a => a.earnedPoints !== null && a.totalPoints !== null && a.totalPoints > 0
  );
  
  if (gradedAssignments.length === 0) return null;
  
  const totalEarned = gradedAssignments.reduce((sum, a) => sum + a.earnedPoints, 0);
  const totalPossible = gradedAssignments.reduce((sum, a) => sum + a.totalPoints, 0);
  
  return totalPossible > 0 ? (totalEarned / totalPossible) * 100 : null;
};

export const calculateGPA = (courses, allAssignments) => {
  const coursesWithGrades = courses.filter(course => {
    const courseAssignments = allAssignments.filter(a => a.courseId === course.id);
    const grade = calculateCourseGrade(courseAssignments);
    return grade !== null;
  });
  
  if (coursesWithGrades.length === 0) return null;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  coursesWithGrades.forEach(course => {
    const courseAssignments = allAssignments.filter(a => a.courseId === course.id);
    const grade = calculateCourseGrade(courseAssignments);
    
    if (grade !== null) {
      const gradePoint = gradeToGPA(grade);
      totalPoints += gradePoint * course.credits;
      totalCredits += course.credits;
    }
  });
  
  return totalCredits > 0 ? totalPoints / totalCredits : null;
};

export const gradeToGPA = (percentage) => {
  if (percentage >= 93) return 4.0;
  if (percentage >= 90) return 3.7;
  if (percentage >= 87) return 3.3;
  if (percentage >= 83) return 3.0;
  if (percentage >= 80) return 2.7;
  if (percentage >= 77) return 2.3;
  if (percentage >= 73) return 2.0;
  if (percentage >= 70) return 1.7;
  if (percentage >= 67) return 1.3;
  if (percentage >= 65) return 1.0;
  return 0.0;
};

export const gradeToLetter = (percentage) => {
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 65) return "D";
  return "F";
};