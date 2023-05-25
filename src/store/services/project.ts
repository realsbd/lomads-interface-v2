import axiosHttp from 'api';

export const createProjectService = (params: any) => {
    return axiosHttp.post(`project`, params);
}