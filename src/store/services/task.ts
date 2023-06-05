import axiosHttp from 'api';

export const getTaskService = (params: any) => {
    return axiosHttp.get(`task/${params}`);
}

export const createTaskService = (params: any) => {
    return axiosHttp.post(`task`, params);
}

export const draftTaskService = (params: any) => {
    return axiosHttp.post(`task/draft`, params);
}

export const archiveTaskService = (params: any) => {
    return axiosHttp.patch(`task/${params.taskId}/archive?daoUrl=${params.daoUrl}`);
}

export const deleteTaskService = (params: any) => {
    return axiosHttp.patch(`task/${params.taskId}/delete?daoUrl=${params.daoUrl}`);
}
