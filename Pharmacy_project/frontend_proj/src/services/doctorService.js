import api from './api';

export const addDoctor = (data) => api.post('/addDoctor', data);
export const viewDoctors = () => api.get('/viewDoctors');
export const deleteDoctor = (id) => api.delete(`/deleteDoctor/${id}`);
