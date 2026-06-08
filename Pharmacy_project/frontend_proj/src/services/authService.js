import api from './api';

export const loginAdmin = (credentials) => api.post('/adminLogin', credentials);
export const loginDoctor = (credentials) => api.post('/doctorLogin', credentials);
export const loginPharmacist = (credentials) => api.post('/pharmacistLogin', credentials);
export const addAdmin = (data) => api.post('/addAdmin', data);
export const viewAdmins = () => api.get('/viewAdmins');
export const deleteAdmin = (id) => api.delete(`/deleteAdmin/${id}`);
