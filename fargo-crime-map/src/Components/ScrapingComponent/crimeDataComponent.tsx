import { useQuery } from "react-query";
import axios from "axios";

type CrimeData = {
  [key: string]: string;
};

function CrimeDataComponent() {
  const scrapeWebsite = async (): Promise<CrimeData[]> => {
    return await axios.get(
      "https://localhost:3000/api/crime-data", // TODO: replace with dynamic URL env variable for local and hosted
    );
  };

  const { data, isLoading, isError } = useQuery<CrimeData[], Error>(
    "scrapedData",
    scrapeWebsite,
    {
      refetchInterval: 500000, // Poll every 500 seconds (adjust as needed)
    },
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
        data.map((crimeData, index) => (
          <>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <div key={`${crimeData}`}>
              Link {index + 1}: {crimeData.title}
            </div>
          </>
        ))}
    </div>
  );
}

export default CrimeDataComponent;
