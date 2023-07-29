import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

export type CrimeDataType = {
  [key: string]: string;
};

const fetchCrimeData = async (
  startDate: string,
  endDate: string,
): Promise<CrimeDataType[]> => {
  const response = await axios.get(
    `https://localhost:3000/api/crime-data?startDate=${startDate}&endDate=${endDate}`,
  );
  return response.data;
};

const useQueryCrimeData = (startDate: string, endDate: string) => {
  const { data, isLoading, isError } = useQuery<CrimeDataType[], Error>(
    "crimeData",
    () => fetchCrimeData(startDate, endDate),
  );
  return {
    crimeData: data,
    isLoadingCrimeData: isLoading,
    isErrorCrimeData: isError,
  };
};

export default useQueryCrimeData;
