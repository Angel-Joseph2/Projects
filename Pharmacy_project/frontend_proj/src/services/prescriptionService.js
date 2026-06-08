import api from './api';

export const addPrescription = (data) => api.post('/addPrescription', data);
export const viewPrescriptions = () => api.get('/viewPrescriptions');
export const deletePrescription = (id) => api.delete(`/deletePrescription/${id}`);
export const getPrescriptionsByDoctor = (doctorId) => api.get(`/viewPrescriptions/doctor/${doctorId}`);
