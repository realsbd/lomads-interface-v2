import axiosHttp from 'api';

export const loadDAOListService = () => {
    return axiosHttp.get('dao')
}

export const loadDAOService = (daoURL: string) => {
    return axiosHttp.get(`dao/${daoURL}`)
}

export const updateDAOService = (params:any) => {
    return axiosHttp.patch(`dao/${params.url}/update-details`, params.payload)
}

export const addDAOMemberService = (params: any) => {
    return axiosHttp.patch(`dao/${params.url}/add-member`, params.payload)
}