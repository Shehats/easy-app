import { EasyApp } from './common/app';
import {User} from './test/user'
// @EasyApp({mongoUrl: 'mongodb://localhost/aya'})

@EasyApp({
  databaseType:"mongodb",
  databaseHost:"localhost",
  databaseName:"test",
  databasePort: 27017,
  synchronizeDatabase: true,
  modelsDir: [User]
})
class Application {
}




