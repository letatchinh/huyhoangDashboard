import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/board-config`, query),
    getAllTask: (query?: any) => requester.get(`/api/v1/task-item-board-config/${query.id}`,omit(query,['id'])),
    getById: (id?: any) => requester.get(`/api/v1/board-config/${id}`),
    create: (data?: any) => requester.post(`/api/v1/board-config`, data),
    getListWorkConfig:(query?:any)=>requester.get(`/api/v1/board-config-parent-board/${query.sprintId}`),
    update: (data?: any) => requester.put(`/api/v1/board-config/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/board-config/${id}`),
}
export default apis;