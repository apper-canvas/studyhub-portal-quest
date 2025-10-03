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

export const assignmentService = {
  async getAllAssignments() {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "total_points_c" } },
          { field: { Name: "earned_points_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "id_c" } }
        ],
        orderBy: [{ fieldName: "due_date_c", sorttype: "ASC" }]
      };

      const response = await client.fetchRecords('assignment_c', params);

      if (!response?.success) {
        console.error('Failed to fetch assignments:', response?.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching assignments:', error?.message || error);
      return [];
    }
  },

  async createRecords(assignmentData) {
    try {
      const client = initializeClient();
      
      const courseId = assignmentData.course_id_c?.Id || assignmentData.course_id_c;
      
      const params = {
        records: [
          {
            Name: assignmentData.title_c,
            course_id_c: parseInt(courseId),
            title_c: assignmentData.title_c,
            description_c: assignmentData.description_c || '',
            due_date_c: assignmentData.due_date_c,
            priority_c: assignmentData.priority_c || 'medium',
            status_c: assignmentData.status_c || 'todo',
            total_points_c: assignmentData.total_points_c ? parseFloat(assignmentData.total_points_c) : null,
            earned_points_c: assignmentData.earned_points_c ? parseFloat(assignmentData.earned_points_c) : null,
            completed_c: assignmentData.completed_c || false,
            id_c: assignmentData.id_c || `assignment-${Date.now()}`
          }
        ]
      };

      const response = await client.createRecord('assignment_c', params);

      if (!response.success) {
        console.error('Failed to create assignment:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create assignment:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          toast.success('Assignment added successfully!');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating assignment:', error?.message || error);
      toast.error('Failed to create assignment');
      return null;
    }
  },

  async updateRecords(assignmentId, assignmentData) {
    try {
      const client = initializeClient();
      
      const updateData = {
        Id: assignmentId
      };

      if (assignmentData.course_id_c !== undefined) {
        const courseId = assignmentData.course_id_c?.Id || assignmentData.course_id_c;
        updateData.course_id_c = parseInt(courseId);
      }
      if (assignmentData.title_c !== undefined) updateData.title_c = assignmentData.title_c;
      if (assignmentData.description_c !== undefined) updateData.description_c = assignmentData.description_c;
      if (assignmentData.due_date_c !== undefined) updateData.due_date_c = assignmentData.due_date_c;
      if (assignmentData.priority_c !== undefined) updateData.priority_c = assignmentData.priority_c;
      if (assignmentData.status_c !== undefined) updateData.status_c = assignmentData.status_c;
      if (assignmentData.total_points_c !== undefined) {
        updateData.total_points_c = assignmentData.total_points_c ? parseFloat(assignmentData.total_points_c) : null;
      }
      if (assignmentData.earned_points_c !== undefined) {
        updateData.earned_points_c = assignmentData.earned_points_c ? parseFloat(assignmentData.earned_points_c) : null;
      }
      if (assignmentData.completed_c !== undefined) updateData.completed_c = assignmentData.completed_c;
      if (assignmentData.Name !== undefined) updateData.Name = assignmentData.Name;

      const params = {
        records: [updateData]
      };

      const response = await client.updateRecord('assignment_c', params);

      if (!response.success) {
        console.error('Failed to update assignment:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update assignment:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          toast.success('Assignment updated successfully!');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating assignment:', error?.message || error);
      toast.error('Failed to update assignment');
      return null;
    }
  },

  async deleteRecords(assignmentIds) {
    try {
      const client = initializeClient();
      const params = {
        RecordIds: Array.isArray(assignmentIds) ? assignmentIds : [assignmentIds]
      };

      const response = await client.deleteRecord('assignment_c', params);

      if (!response.success) {
        console.error('Failed to delete assignment:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete assignment:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        toast.success('Assignment deleted successfully!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting assignment:', error?.message || error);
      toast.error('Failed to delete assignment');
      return false;
    }
  }
};