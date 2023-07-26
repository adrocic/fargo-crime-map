import { useQuery } from "react-query";
import axios from "axios";

type CrimeDataType = {
  [key: string]: string;
};

const CrimeData = () => {
  const fetchCrimeData = async (): Promise<CrimeDataType[]> => {
    const response = await axios.get(
      "https://localhost:3000/api/crime-data?startDate=7/23/2023&endDate=7/26/2023", // TODO: replace with dynamic URL env variable for local and hosted
    );
    return response.data; // Extract the data property and return it
  };

  const { data, isLoading, isError } = useQuery<CrimeDataType[], Error>(
    "crimeData",
    fetchCrimeData,
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching data.</div>;
  }

  return (
    <div>
      {data &&
        data.map((crimeDatas, index) => (
          <>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <div key={`${crimeDatas}`}>
              Link {index + 1}: {crimeDatas.title}
            </div>
          </>
        ))}
    </div>
  );
};

export default CrimeData;
