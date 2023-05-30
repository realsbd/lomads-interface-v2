import axiosHttp from 'api';

export const createTaskService = (params: any) => {
    return axiosHttp.post(`task`, params);
}

export const draftTaskService = (params: any) => {
    return axiosHttp.post(`task/draft`, params);
}
