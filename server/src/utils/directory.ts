import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('DirectoryUtils');

/**
 * Creates all directories in the path if they don't exist
 * @param dirPath The directory path to ensure exists
 */
export function ensureDirectoryExists(dirPath: string): void {
  try {
    if (!fs.existsSync(dirPath)) {
      logger.log(`Creating directory: ${dirPath}`);
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    logger.error(`Error creating directory ${dirPath}: ${error.message}`);
    throw error;
  }
}

/**
 * Creates the necessary directory structure for storing map tiles
 */
export function setupMapTileDirectories(): void {
  const staticPath = path.join(process.cwd(), 'static');
  const maptilesPath = path.join(staticPath, 'maptiles');

  // Create main directories
  ensureDirectoryExists(staticPath);
  ensureDirectoryExists(maptilesPath);

  // Create zoom level directories (0-18 is typical for OSM)
  for (let z = 0; z <= 18; z++) {
    const zoomPath = path.join(maptilesPath, z.toString());
    ensureDirectoryExists(zoomPath);

    // For demonstration, create a few x directories at lower zoom levels
    if (z <= 2) {
      for (let x = 0; x < 4; x++) {
        ensureDirectoryExists(path.join(zoomPath, x.toString()));
      }
    }
  }

  logger.log('Map tile directory structure created');
}
