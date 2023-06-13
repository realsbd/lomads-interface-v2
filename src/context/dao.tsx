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
import { CHAIN_INFO } from 'constants/chainInfo';
import { logoutAction, setTokenAction, setUserAction } from 'store/actions/session';
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

  const { balanceOf, isNFTMinted } = useMintSBT(DAO?.sbt?.address, DAO?.sbt?.version, +DAO?.sbt?.chainId)

  const loadDAOList = async () => {
    dispatch(loadDAOListAction())
  }

  const loadDAO = async (url: string) => {
    dispatch(loadDAOAction(url))
  }
  
  useEffect(() => {
    if(!token)
      navigate(`/login`)
  }, [token])

  useEffect(() => {
    console.log("loadDAOList", account, token)
    if ((!daoURL || daoURL) && account && token && !DAOList){
      resetDAO()
      loadDAOList()
    }
  }, [account, token, DAOList, daoURL])

  useEffect(() => {
    if (DAOList && !daoURL && window.location.pathname === '/') {
      if (DAOList.length > 0)
        navigate(`/${_get(DAOList, '[0].url')}`)
      else
        navigate(`/organisation/create`)
    }
  }, [DAOList])

  useEffect(() => {
    if (provider && account && DAO?.url && DAO?.sbt) {
      // isNFTMinted({ chainId: DAO?.sbt?.chainId, tokenAddress: DAO?.sbt?.address })
      balanceOf().then(res => {
        console.log("Balance of...", parseInt(res._hex, 16))
        if (parseInt(res._hex, 16) === 1) {

        } else {
          if (!DAO?.sbt?.whitelisted || (DAO?.sbt?.whitelisted && _find(DAO?.members, (member: any) => toChecksumAddress(member.member.wallet) === account))) {
            navigate(`/${DAO?.url}/mint/${DAO?.sbt?.address}`)
          } else {
            // NOT WHITELISTED
            navigate(`/${DAO?.url}/only-whitelisted`)
          }
        }
      })
      .catch(e => {
        console.log(e)
      })
    }
  }, [DAO?.url, provider, account])

  useEffect(() => {
    if (DAOList && account && token && daoURL && (!DAO || DAO.url !== daoURL))
      loadDAO(daoURL)
  }, [account, token, daoURL, console, DAOList])

  useEffect(() => {
    if (window.location.pathname.indexOf('attach-safe/new') == -1 && DAO && (!DAO.safes || (DAO.safes && DAO.safes.length == 0))) {
      navigate(`/${DAO?.url}/attach-safe/new`, { state: { createFlow: true } })
    }
  }, [DAO?.safes])

  const resetDAO = () => {
    dispatch(resetDAOAction())
  }

  const updateDAO = (payload: any) => {
    dispatch(updateDAOAction(payload))
  }

  const contextProvider = {
    DAO, DAOList, resetDAO, updateDAO, loadDAO
  };
  return <DAOContext.Provider value={contextProvider}>
    {
      privateRoute && (!DAOList || (daoURL && !DAO)) ? <FullScreenLoader /> : children
    }
  </DAOContext.Provider>;
};