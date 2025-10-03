import { toast } from 'react-toastify';

let apperClient = null;

const initializeClient = () => {
  if (!apperClient) {
    const { ApperClient } = window.ApperSDK;
    apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
  return apperClient;
};

export const courseService = {
  async getAllCourses() {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "id_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "ASC" }]
      };

      const response = await client.fetchRecords('course_c', params);

      if (!response?.success) {
        console.error('Failed to fetch courses:', response?.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching courses:', error?.message || error);
      return [];
    }
  },

  async createRecords(courseData) {
    try {
      const client = initializeClient();
      const params = {
        records: [
          {
            Name: courseData.code_c || courseData.name_c,
            code_c: courseData.code_c,
            name_c: courseData.name_c,
            instructor_c: courseData.instructor_c,
            credits_c: courseData.credits_c,
            color_c: courseData.color_c,
            semester_c: courseData.semester_c || 'Fall 2024',
            archived_c: false,
            id_c: courseData.id_c || `course-${Date.now()}`
          }
        ]
      };

      const response = await client.createRecord('course_c', params);

      if (!response.success) {
        console.error('Failed to create course:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create course:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          toast.success('Course added successfully!');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating course:', error?.message || error);
      toast.error('Failed to create course');
      return null;
    }
  },

  async updateRecords(courseId, courseData) {
    try {
      const client = initializeClient();
      const updateData = {
        Id: courseId,
        code_c: courseData.code_c,
        name_c: courseData.name_c,
        instructor_c: courseData.instructor_c,
        credits_c: courseData.credits_c,
        color_c: courseData.color_c
      };

      if (courseData.Name) {
        updateData.Name = courseData.Name;
      }

      const params = {
        records: [updateData]
      };

      const response = await client.updateRecord('course_c', params);

      if (!response.success) {
        console.error('Failed to update course:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update course:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          toast.success('Course updated successfully!');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating course:', error?.message || error);
      toast.error('Failed to update course');
      return null;
    }
  },

  async deleteRecords(courseIds) {
    try {
      const client = initializeClient();
      const params = {
        RecordIds: Array.isArray(courseIds) ? courseIds : [courseIds]
      };

      const response = await client.deleteRecord('course_c', params);

      if (!response.success) {
        console.error('Failed to delete course:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete course:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        toast.success('Course deleted successfully!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting course:', error?.message || error);
      toast.error('Failed to delete course');
      return false;
    }
  }
};