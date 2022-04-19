import React, { useEffect, useState } from "react"
import { useFetchWrapper } from "../helpers"
import { Platform } from 'react-native'
import { ACCOUNT_SERVICE_API_URL } from '../injectable'
import { useIsFocused } from '@react-navigation/native'

export default function useAdminUserAccounts() {
    const fetchWrapper = useFetchWrapper()
    const isFocused = useIsFocused()

    // How much entries per fetchUser request
    const [serverError, setServerError] = useState()
    const [userResponse, setuserResponse] = useState()
    const [searchField, setSearchField] = useState()


    useEffect(() => {
        if (!isFocused) return
        fetchUsers(userResponse?.pageIndex || 1)

    }, [isFocused, searchField])


    const goPrevious = () => {
        if (!userResponse) return;
        fetchUsers(userResponse.pageIndex - 1)
    }

    const goNext = () => {
        if (!userResponse) return;
        fetchUsers(userResponse.pageIndex + 1)
    }

    async function fetchUsers(pageNumber) {
        const baseUrl = `${ACCOUNT_SERVICE_API_URL}/api/accountadmin?pageNumber=${pageNumber}&pageEntries=${Platform.OS == "web" ? 12 : 4}${searchField ? `&searchQuery=${searchField}` : ``}`
        const res = await fetchWrapper.get(`${baseUrl}`).catch(er => {
            setServerError(er?.message)
        })
        setuserResponse(res)
    }

    return {
        serverError,
        goPrevious,
        goNext,
        fetchUsers,
        userResponse,
        searchField,
        setSearchField,
    }
}