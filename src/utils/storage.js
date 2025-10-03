const STORAGE_KEYS = {
  COURSES: "studyhub_courses",
  ASSIGNMENTS: "studyhub_assignments",
  SEMESTER: "studyhub_semester",
};

export const storage = {
  getCourses: () => {
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : [];
  },
  
  setCourses: (courses) => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },
  
  getAssignments: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : [];
  },
  
  setAssignments: (assignments) => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },
  
  getSemester: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SEMESTER);
    return data ? JSON.parse(data) : { name: "Fall 2024", active: true };
  },
  
  setSemester: (semester) => {
    localStorage.setItem(STORAGE_KEYS.SEMESTER, JSON.stringify(semester));
  },
};