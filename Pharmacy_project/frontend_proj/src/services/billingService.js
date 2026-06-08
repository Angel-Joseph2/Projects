import api from './api';

export const addBill = (data) => api.post('/addBill', data);
export const viewBills = () => api.get('/viewBills');
export const deleteBill = (id) => api.delete(`/deleteBill/${id}`);
