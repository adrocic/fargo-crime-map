import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import * as cheerio from 'cheerio';

type CrimeData = {
  dateAndTime: string;
  address: string;
  callType: string;
  description: string;
};

function ScrapingComponent() {
  const scrapeWebsite = async (): Promise<Link[]> => {
    const response = await axios.get('https://fargond.gov/city-government/departments/police/police-records-data/dispatch-logs');
    const html = response.data;
    const $ = cheerio.load(html);
    const crimeData: CrimeData[] = [];
    $('tbody tr').each((index, element) => {
      const row = {};
      $(element).find('td').each((cellIndex, cellElement) => {
        const column = ['dateTime', 'address', 'callType', 'description'][cellIndex];
        row[column] = $(cellElement).text().trim();
      });
      crimeData.push(row);
    });
    console.log(crimeData); // Use the extracted data as needed
    return crimeData;
  };

  const { data, isLoading, isError } = useQuery<Link[], Error>('scrapedData', scrapeWebsite, {
    refetchInterval: 5000, // Poll every 5 seconds (adjust as needed)
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching data.</div>;
  }

  return (
    <div>
      {crimeData && crimeData.map((link, index) => (
        <pre>{JSON.stringify(crimeData, null, 2)}</pre>
        <div key={index}>Link {index + 1}: {link.title}</div>
      ))}
    </div>
  );
}

export default ScrapingComponent;
