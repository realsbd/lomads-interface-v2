import axiosHttp from 'api';

export const createAccountService = (token: string) => {
    return axiosHttp.post(`auth/create-account`, {}, { headers: { Authorization: token } })
}