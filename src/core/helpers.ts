import * as PropertiesReader from 'properties-reader';
import { Config, PropertyConfigurer } from './config';

export const constructType = <T>(data: Object, type: (new(...args:any[])=>T)): T => {
  const retVal: T = new type();
  Object.getOwnPropertyNames(data)
  .forEach(x => {
	retVal[x] = data[x]
  })
  return retVal
}

export const configReader = <T extends PropertyConfigurer> (path: string, 
  target: (new(...args:any[]) => T), qualifier?: string): T => {
  let properties = PropertiesReader(path);
  let config: Config = {};
  Object.keys(config)
  .forEach(x => {
    config[x] = properties(qualifier+x)
  })
  return new target(config)
}
