import React, { useCallback } from "react";
import { find as _find } from 'lodash'
import { useDAO } from "context/dao";

export default () => {
    const { DAO } = useDAO();

    const loadSafe = useCallback((safeAddress: string) => {
        return _find(DAO?.safes, (safe:any) => safe?.address === safeAddress)
    }, [DAO])

    return { loadSafe }
}