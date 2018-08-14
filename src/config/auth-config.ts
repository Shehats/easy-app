import { Config, PropertyConfigurer } from './config';
import { Strategy } from 'passport';

export interface PassportConfig extends Config {
  strategy: (new(...args:any[])=>Strategy),
  params: any,
  keys: string|string[],
  hookFunc?: Function,
  createFunc: Function,
  name: string
}

export class PassportConfigurer extends PropertyConfigurer {
  constructor (config: PassportConfig) {
    super(config);
  }
}
