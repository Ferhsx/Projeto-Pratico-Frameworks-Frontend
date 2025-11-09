import api from '../api/api';

export const adminService = {
    async getDashboardStats() {
        return api.get('/admin/dashboard');
    }
};