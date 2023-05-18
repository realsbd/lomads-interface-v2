import React, { useEffect, useState } from 'react';
import {  get as _get } from 'lodash'
import { createContext, useContext } from "react";
import { useParams } from 'react-router-dom';
import axiosHttp from 'api'
import { useWeb3Auth } from './web3Auth';
import { useAppSelector } from 'helpers/useAppSelector';
import { useNavigate } from 'react-router-dom';
import FullScreenLoader from 'components/FullScreenLoader';
import { useAppDispatch } from 'helpers/useAppDispatch';
import { loadDAOAction, loadDAOListAction, resetDAOAction } from 'store/actions/dao';

export const DAOContext = createContext<any>({

});

export function useDAO() {
  return useContext(DAOContext);
}

export const DAOProvider = ({ privateRoute = false, children }: any) => {
  const { account } = useWeb3Auth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //@ts-ignore
  const { token } = useAppSelector(store => store.session);
  const { daoURL } = useParams();
  //@ts-ignore
  const { DAO, DAOList } = useAppSelector(store => store?.dao)

  const loadDAOList = async () => {
    dispatch(loadDAOListAction())
  }

  const loadDAO = async (url: string) => {
    dispatch(loadDAOAction(url))
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

  const resetDAO = () => {
    dispatch(resetDAOAction())
  }

  const contextProvider = {
    DAO, DAOList, resetDAO
  };
  return <DAOContext.Provider value={contextProvider}>
    {
        privateRoute && (!DAOList || (daoURL && !DAO)) ?  <FullScreenLoader skeleton="dashboard" /> : children
    }
  </DAOContext.Provider>;
};