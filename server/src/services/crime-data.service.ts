import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CrimeDataProps } from '../modules/crime-data.module';

@Injectable()
export class CrimeDataService {
  async getCrimeData(
    startDate = '7/24/2023',
    endDate = '7/25/2023',
  ): Promise<CrimeDataProps[]> {
    try {
      const response: CrimeDataProps[] = await axios.get(
        `https://fargond.gov/dispatchLogs?startDate=${startDate}&endDate=${endDate}`,
      );
      return response;
    } catch (error) {
      // Handle error
      console.error('Error scraping crime data:', error);
      return [];
    }
  }
}
