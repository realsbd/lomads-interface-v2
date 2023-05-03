import React, { useEffect, useState } from 'react';
import { pick as _pick, get as _get } from 'lodash';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import FullScreenLoader from 'components/FullScreenLoader';
import { useAppSelector } from 'helpers/useAppSelector';
import { useAppDispatch } from 'helpers/useAppDispatch';
import { useWeb3Auth } from 'context/web3Auth';

const PrivateRoute = (props: any) => {
	const dispatch = useAppDispatch()
	const { account, chainId } = useWeb3Auth();
	const { token, user  } = useSelector((store:any) => store.session);
	console.log("chainId", chainId)
	if ((!account || !token || !user) && props.private) {
		if(window.location.pathname !== '/')
			window.location.href = `/login?from=${window.location.pathname}`
		else
			window.location.href = `/login`
	} else {
		return props.orRender;
	}
};
export default PrivateRoute;
