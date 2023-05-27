import axiosHttp from 'api';

export const getProjectService = (params: any) => {
    return axiosHttp.get(`project/${params}`);
}

export const createProjectService = (params: any) => {
    return axiosHttp.post(`project`, params);
}