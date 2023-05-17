import React, { useEffect, useState } from 'react';
import {  get as _get } from 'lodash'
import { createContext, useContext } from "react";
import { useParams } from 'react-router-dom';
import axiosHttp from 'api'
import { useWeb3Auth } from './web3Auth';
import { useAppSelector } from 'helpers/useAppSelector';
import { useNavigate } from 'react-router-dom';
import FullScreenLoader from 'components/FullScreenLoader';

export const DAOContext = createContext<any>({

});

export function useDAO() {
  return useContext(DAOContext);
}

export const DAOProvider = ({ children }: any) => {
  const { account } = useWeb3Auth();
  const navigate = useNavigate();
  //@ts-ignore
  const { token } = useAppSelector(store => store.session);
  const { daoURL } = useParams();
  const [DAO, setDAO] = useState<any>(null)
  const [DAOList, setDAOList] = useState<any>(null)

  const loadDAOList = async () => {
    const daoList = await axiosHttp.get('dao').then(res => res.data).catch(e => console.log(e))
    console.log("RESPONSE_DAO_LIST", daoList)
    setDAOList(daoList)
  }

  const loadDAO = async (url: string) => {
    const dao = await axiosHttp.get(`dao/${url}`).then(res => res.data).catch(e => console.log(e))
    setDAO(dao)
  }

  useEffect(() => {
    if(account && token && !DAOList)
        loadDAOList()
  }, [account, token, DAOList])

  useEffect(() => {
    if(DAOList && !daoURL) {
        console.log("DAOList", DAOList)
        if(DAOList.length > 0)
            navigate(`/${_get(DAOList, '[0].url')}`)
        else
            navigate(`/create-dao`)
    }
  }, [DAOList])

  useEffect(() => {
    if(DAOList && DAOList.length > 0 && account && token && daoURL && (!DAO || DAO.url !== daoURL))
        loadDAO(daoURL)
  }, [account, token, daoURL, console, DAOList])

  const contextProvider = {
    DAO
  };
  return <DAOContext.Provider value={contextProvider}>
    {
        !DAOList || (daoURL && !DAO) ?  <FullScreenLoader skeleton="dashboard" /> : children
    }
  </DAOContext.Provider>;
};