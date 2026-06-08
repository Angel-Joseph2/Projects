import api from './api';

export const getMedicines = () => api.get('/viewMedicine');
export const addMedicine = (data) => api.post('/addMedicine', data);
export const updateMedicine = (id, data) => api.put(`/updateMedicine/${id}`, data);
export const deleteMedicine = (id) => api.delete(`/deleteMedicine/${id}`);
