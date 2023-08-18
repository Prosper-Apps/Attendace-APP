import { getUserCustomIn } from "../api/userApi";
import { useState, useEffect } from "react";

export const useUserStatus = (employeeCode) => {
    const [data, setData] = useState({ loading: false, apiData: null, error: null });

    const fetchStatus = async () => {
        try {
            setData(prev => ({ ...prev, loading: true, error: null }));
            getUserCustomIn(employeeCode).then((jsonData) => {
                const [{ custom_in }] = jsonData.data;
                setData(prev => ({ ...prev, apiData: custom_in, loading: false }));
            }).catch(() => {
                setData(prev => ({ ...prev, error: true, loading: false }));
            });

        } catch (error) {
            setData(prev => ({ ...prev, error: true, loading: false }));
        }
    };

    const retry = () => {
        fetchStatus();
    };

    useEffect(() => {
        fetchStatus();
    }, [employeeCode]);
    console.log(data);
    return { ...data, retry };
}
