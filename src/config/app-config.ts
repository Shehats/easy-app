import { Config, PropertyConfigurer } from './config';

export interface AppConfig extends Config {
  port?: number,
  appSecret?: string,
  distDir?: string,
  databaseType?: string,
  databaseUrl?: string,
  databaseHost?: string,
  databasePort?: number,
  databaseUsername?: string,
  databasePassword?: string,
  databaseName?: string,
  synchronizeDatabase?: boolean,
  modelsDir?: any[]
}

export class AppConfigurer extends PropertyConfigurer {
  constructor(config: AppConfig) {
    super(config)
  }
}
