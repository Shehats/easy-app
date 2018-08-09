export interface Config {}

export abstract class PropertyConfigurer {
  private _config: Config;
  constructor (config: Config) {
    this._config = config;
  }
  
  get Config (): Config {
    return this._config;
  }

  set Config(config: Config) {
    this._config = config;
  }
}

export interface Routes {
  getUrl?: string,
  getByIdUrl?: string,
  getByKeyUrl?: string,
  postUrl?: string,
  putUrl?: string,
  deleteUrl?: string,
  queryUrl?: string
}
