import { format } from "date-fns";
import useQueryCrimeData from "Hooks/QueryCrimeData/useQueryCrimeData";

const CrimeData = () => {
  const formattedStartDate = format(new Date(), "M/d/yyyy");
  const formattedEndDate = format(new Date(), "M/d/yyyy");

  const { crimeData, isLoadingCrimeData, isErrorCrimeData } = useQueryCrimeData(
    formattedStartDate,
    formattedEndDate,
  );

  if (isLoadingCrimeData) {
    return <div>Loading...</div>;
  }

  if (isErrorCrimeData) {
    return <div>Error occurred while fetching data.</div>;
  }

  return (
    <div>
      {crimeData &&
        crimeData.map((crimeDatas, index) => (
          <>
            <pre>{JSON.stringify(crimeData, null, 2)}</pre>
            <div key={`${crimeDatas}`}>
              Link {index + 1}: {crimeDatas.title}
            </div>
          </>
        ))}
    </div>
  );
};

export default CrimeData;
