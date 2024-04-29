import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/sales-group`, query),
    getAllBuyGroup: (query?: any) => requester.get(`/api/v1/workspace/partner`, query),
    getBlackList: () => requester.get(`/api/v1/check/sales-group`),
    getListTeamLead: (query?: any) => requester.get(`/api/v1/employee-search-lead`, query),
    getListMember: (query?: any) => requester.get(`/api/v1/employee-search-member`, query),
    getById: (id?: any) => requester.get(`/api/v1/sales-group/${id}`),
    create: (data?: any) => requester.post(`/api/v1/sales-group`, data),
    update: (data?: any) => requester.put(`/api/v1/sales-group/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/sales-group/${id}`),
}
export default apis;
