import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/staffs`, query),
    getListEmployeeGroup: (query?: any) => requester.get(`/api/v1/list-partner-group`, query),
    getAllAuthorIsVoucher: (query?: any) => requester.get(`/api/v1/staffs-voucher`, query),
    getById: (id?: any) => requester.get(`/api/v1/staff/${id}`),
    create: (data?: any) => requester.post(`/api/v1/staff-create`, data),
    update: (data?: any) => requester.put(`/api/v1/staff-update/${get(data,'id')}`, omit(data, ['id'])),
    delete: (id?: any) => requester.delete(`/api/v1/staff-delete/${id}`),
    validateUsername: (query: any) => requester.post(`/api/v1/user/validate-user`, query),
    getPolicy: (query: any) => requester.get(`/api/v1/user-policy`),
    getProfile: () => requester.get(`/api/v1/staff-profile-detail`),
    updateProfile: (data?: any) => requester.put(`/api/v1/staff-update-detail`, data),
}
export default apis;
