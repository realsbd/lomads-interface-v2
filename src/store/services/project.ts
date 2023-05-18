import axiosHttp from 'api';

export const createProjectService = (token: string) => {
    return axiosHttp.post(`auth/create-account`, {}, { headers: { Authorization: token } })
}