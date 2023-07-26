import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CrimeDataProps } from '../modules/crime-data.module';

interface CrimeDataServiceResponse {
  status: number;
  statusText: string;
  headers: any; // You can create a specific type for AxiosHeaders if needed
  config: any; // You can create a specific type for AxiosRequestConfig if needed
  request: any; // You can create a specific type for ClientRequest if needed
  data: CrimeDataProps[]; // Use the previously defined YourData interface here
}

@Injectable()
export class CrimeDataService {
  async getCrimeData(
    startDate = '7/24/2023',
    endDate = '7/25/2023',
  ): Promise<CrimeDataProps[]> {
    try {
      const response: CrimeDataServiceResponse = await axios.get(
        `https://fargond.gov/dispatchLogs?startDate=${startDate}&endDate=${endDate}`,
      );
      return response.data;
    } catch (error) {
      // Handle error
      console.error('Error scraping crime data:', error);
      return [];
    }
  }
}
