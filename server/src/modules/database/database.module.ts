import { Module, Global } from '@nestjs/common';
import { CouchDbService } from '../../services/couchdb/couchdb.service';

@Global() // Make this module global so the service is available everywhere
@Module({
  providers: [CouchDbService],
  exports: [CouchDbService],
})
export class DatabaseModule {}
