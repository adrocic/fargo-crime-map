import { useQuery } from "react-query";
import axios from "axios";
import { format } from "date-fns";

export type CrimeDataType = {
  [key: string]: string;
};

const fetchCrimeData = async (
  startDate: Date,
  endDate: Date,
): Promise<CrimeDataType[]> => {
  try {
    const formattedStartDate = format(startDate, "M/d/yyyy");
    const formattedEndDate = format(endDate, "M/d/yyyy");
    const response = await axios.get(
      `https://localhost:3000/api/crime-data?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const useQueryCrimeData = (startDate: Date, endDate: Date) => {
  const { data, isLoading, isError } = useQuery<CrimeDataType[], Error>(
    ["crimeData", startDate, endDate],
    () => fetchCrimeData(startDate, endDate),
  );
  return {
    crimeData: data,
    isLoadingCrimeData: isLoading,
    isErrorCrimeData: isError,
  };
};

export default useQueryCrimeData;
