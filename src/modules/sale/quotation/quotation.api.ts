import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/quotation`, query),
    getById: (id?: any) => requester.get(`/api/v1/quotation/${id}`),
    create: (data?: any) => requester.post(`/api/v1/quotation`, data),
    update: (data?: any) => requester.put(`/api/v1/quotation/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/quotation/${id}`),
}
export default apis;
