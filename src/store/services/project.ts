import axiosHttp from 'api';

export const createProjectService = (params: any) => {
    console.log("project service : ", params);
    return axiosHttp.post(`project`, params);
}