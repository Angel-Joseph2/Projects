import api from './api';

export const addPharmacist = (data) => api.post('/addPharmacist', data);
export const viewPharmacists = () => api.get('/viewPharmacists');
export const deletePharmacist = (id) => api.delete(`/deletePharmacist/${id}`);
