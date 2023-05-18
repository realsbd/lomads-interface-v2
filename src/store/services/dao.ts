import axiosHttp from 'api';

export const loadDAOListService = () => {
    return axiosHttp.get('dao')
}

export const loadDAOService = (daoURL: string) => {
    return axiosHttp.get(`dao/${daoURL}`)
}