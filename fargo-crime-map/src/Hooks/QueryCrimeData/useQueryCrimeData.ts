// src/hooks/useQueryCrimeData.ts
import { useQuery } from "react-query";
import axios from "axios";
import { format } from "date-fns";

export type CrimeDataType = {
    [key: string]: string;
    latitude: string;
    longitude: string;
};

const fetchDispatchData = async (filters: any): Promise<CrimeDataType[]> => {
    try {
        const params = new URLSearchParams();

        if (filters?.startDate) {
            params.append("startDate", format(filters?.startDate, "M/d/yyyy"));
        }
        if (filters?.endDate) {
            params.append("endDate", format(filters?.endDate, "M/d/yyyy"));
        }
        // if (filters?.callType) {
        //     params.append("callType", filters?.callType);
        // }

        const response = await axios.get(`http://localhost:3000/api/dispatch?${params.toString()}`);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const useQueryCrimeData = (filters: { startDate: Date; endDate: Date; [key: string]: any }) => {
    const { data, isLoading, isError } = useQuery<CrimeDataType[], Error>(
        ["crimeData", filters],
        () => fetchDispatchData(filters),
        {
            retry: 2,
            keepPreviousData: true,
        },
    );
    return {
        crimeData: data,
        isLoadingCrimeData: isLoading,
        isErrorCrimeData: isError,
    };
};

export default useQueryCrimeData;
