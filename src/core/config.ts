import { Strategy } from 'passport';

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

export abstract class BaseController <T> {
}

export interface PassportConfig {
  strategy: (new(...args:any[])=>Strategy),
  params: any,
  name: string
}

export interface Routes {
  getUrl?: string,
  getByIdUrl?: string,
  getByKeyUrl?: string,
  postUrl?: string,
  putUrl?: string,
  deleteUrl?: string,
  queryUrl?: string,
  registerUrl?: string,
  loginUrl?: string,
  logoutUrl?: string
}
