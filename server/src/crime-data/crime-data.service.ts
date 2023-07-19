import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CrimeDataProps } from './crime-data.module';

@Injectable()
export class CrimeDataService {
  async getCrimeData(): Promise<CrimeDataProps[]> {
    try {
      const response = await axios.get(
        'https://fargond.gov/city-government/departments/police/police-records-data/dispatch-logs',
      );
      const html = response.data;
      const $ = cheerio.load(html);
      const crimeData: CrimeDataProps[] = [];

      $('tbody tr').each((index, element) => {
        const row: CrimeDataProps = {
          dateAndTime: '',
          address: '',
          callType: '',
          description: '',
        };

        $(element)
          .find('td')
          .each((cellIndex, cellElement) => {
            const column = ['dateTime', 'address', 'callType', 'description'][
              cellIndex
            ];
            row[column] = $(cellElement).text().trim();
          });

        crimeData.push(row);
      });

      console.log(crimeData); // Use the extracted data as needed
      return crimeData;
    } catch (error) {
      // Handle error
      console.error('Error scraping crime data:', error);
      return [];
    }
  }
}
