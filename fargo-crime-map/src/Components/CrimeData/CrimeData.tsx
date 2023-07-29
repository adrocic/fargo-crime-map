import useQueryCrimeData from "Hooks/QueryCrimeData/useQueryCrimeData";

const CrimeData = () => {
  const { crimeData, isLoadingCrimeData, isErrorCrimeData } =
    useQueryCrimeData();

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
