import axiosHttp from 'api';

export const createAccountService = (token: string) => {
    return axiosHttp.post(`auth/create-account`, {}, { headers: { Authorization: token } })
}

export const updateAccountService = (payload: any) => {
    return axiosHttp.patch(`auth/me`, payload)
}