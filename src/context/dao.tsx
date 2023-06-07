import React, { useEffect, useState } from 'react';
import { get as _get, find as _find } from 'lodash'
import { createContext, useContext } from "react";
import { useParams } from 'react-router-dom';
import axiosHttp from 'api'
import { useWeb3Auth } from './web3Auth';
import { useAppSelector } from 'helpers/useAppSelector';
import { useNavigate } from 'react-router-dom';
import FullScreenLoader from 'components/FullScreenLoader';
import { useAppDispatch } from 'helpers/useAppDispatch';
import { loadDAOAction, loadDAOListAction, resetDAOAction, updateDAOAction } from 'store/actions/dao';
import useMintSBT from 'hooks/useMintSBT.v2';
const { toChecksumAddress } = require('ethereum-checksum-address')

export const DAOContext = createContext<any>({

});

export function useDAO() {
  return useContext(DAOContext);
}

export const DAOProvider = ({ privateRoute = false, children }: any) => {
  const { account, provider } = useWeb3Auth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //@ts-ignore
  const { token } = useAppSelector(store => store.session);
  const { daoURL } = useParams();
  //@ts-ignore
  const { DAO, DAOList } = useAppSelector(store => store?.dao)

  const { balanceOf } = useMintSBT(DAO?.sbt?.address, DAO?.sbt?.version)

  const loadDAOList = async () => {
    dispatch(loadDAOListAction())
  }

  const loadDAO = async (url: string) => {
    dispatch(loadDAOAction(url))
  }

  useEffect(() => {
    if (account && token && !DAOList)
      loadDAOList()
  }, [account, token, DAOList])

  useEffect(() => {
    if (DAOList && !daoURL && window.location.pathname === '/') {
      console.log("DAOList", DAOList)
      if (DAOList.length > 0)
        navigate(`/${_get(DAOList, '[0].url')}`)
      else
        navigate(`/organisation/create`)
    }
  }, [DAOList])

  useEffect(() => {
    if (provider && account && DAO?.url && DAO?.sbt) {
      balanceOf().then(res => {
        console.log("Balance of...", parseInt(res._hex, 16))
        if (parseInt(res._hex, 16) === 1) {

        } else {
          if (!DAO?.sbt?.whitelisted || (DAO?.sbt?.whitelisted && _find(DAO?.members, (member: any) => toChecksumAddress(member.member.wallet) === account))) {
            navigate(`/${DAO?.url}/mint/${DAO?.sbt?.address}`)
          } else {
            // NOT WHITELISTED
          }
        }
      })
    }
  }, [DAO?.url, provider, account])

  useEffect(() => {
    if (DAOList && account && token && daoURL && (!DAO || DAO.url !== daoURL))
      loadDAO(daoURL)
  }, [account, token, daoURL, console, DAOList])

  useEffect(() => {
    if (DAO && (!DAO.safes || (DAO.safes && DAO.safes.length == 0))) {
      navigate(`/${DAO?.url}/attach-safe/new`)
    }
  }, [DAO])

  const resetDAO = () => {
    dispatch(resetDAOAction())
  }

  const updateDAO = (payload: any) => {
    dispatch(updateDAOAction(payload))
  }

  const contextProvider = {
    DAO, DAOList, resetDAO, updateDAO
  };
  return <DAOContext.Provider value={contextProvider}>
    {
      privateRoute && (!DAOList || (daoURL && !DAO)) ? <FullScreenLoader /> : children
    }
  </DAOContext.Provider>;
};