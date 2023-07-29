import { useQuery } from "react-query";
import axios from "axios";
import { format } from "date-fns";

export type CrimeDataType = {
  [key: string]: string;
};

const fetchCrimeData = async (
  startDate?: Date,
  endDate?: Date,
): Promise<CrimeDataType[]> => {
  try {
    const formattedStartDate = format(startDate ?? new Date(), "M/d/yyyy");
    const formattedEndDate = format(endDate ?? new Date(), "M/d/yyyy");
    const response = await axios.get(
      `http://localhost:3000/api/crime-data?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const useQueryCrimeData = (startDate?: Date, endDate?: Date) => {
  const { data, isLoading, isError } = useQuery<CrimeDataType[], Error>({
    queryKey: ["crimeData", startDate, endDate],
    queryFn: () => fetchCrimeData(startDate, endDate),
    retry: 2,
  });
  return {
    crimeData: data,
    isLoadingCrimeData: isLoading,
    isErrorCrimeData: isError,
  };
};

export default useQueryCrimeData;
