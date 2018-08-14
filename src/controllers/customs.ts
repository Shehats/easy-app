import { is, Easily } from 'easy-injectionjs';
import { Express } from 'express';

export const CustomController = <T extends {new(...args:any[]):{}}>
  (url: string) => function(target: T): any {
    Easily(target.name.toUpperCase()+'_CONTROLLER', '/'+url);
  }

export function PasswordField (target: Object, propertyKey: string) {
    Easily(target.constructor.name.toUpperCase()+'_PASSWORD', propertyKey);
 }

export const Get = <T extends {new(...args:any[]):{}}>
  (url: string) => function (target: any, 
  propertyKey: string, descriptor: PropertyDescriptor) {
  let app = <Express>is('App');
  let base = <string>is(target.name.toUpperCase()+'_CONTROLLER');
  if (!app) {
    let getQueue = <any[]>is('GET_QUEUE') || [];
    getQueue.push({url: base+'/'+url, func: target[propertyKey]});
    Easily('GET_QUEUE', getQueue);
  } else {
    app.get(url, target[propertyKey]);
  }
}

export const Post = <T extends {new(...args:any[]):{}}>
  (url: string) => function (target: T, 
  propertyKey: string, descriptor: PropertyDescriptor) {
  let app = <Express>is('App');
  let base = <string>is(target.name.toUpperCase()+'_CONTROLLER');
  if (!app) {
    let postQueue = <any[]>is('POST_QUEUE') || [];
    postQueue.push({url: base+'/'+url, func: target[propertyKey]});
    Easily('POST_QUEUE', postQueue);
  } else {
    app.post(url, target[propertyKey])
  }
}

export const Put = <T extends {new(...args:any[]):{}}>
  (url: string) => function (target: T, 
  propertyKey: string, descriptor: PropertyDescriptor) {
  let app = <Express>is('App');
  let base = <string>is(target.name.toUpperCase()+'_CONTROLLER');
  if (!app) {
    let putQueue = <any[]>is('PUT_QUEUE') || [];
    putQueue.push({url: base+'/'+url, func: target[propertyKey]});
    Easily('PUT_QUEUE', putQueue);
  } else {
    app.put(url, target[propertyKey]);
  }
}

export const Delete = <T extends {new(...args:any[]):{}}>
  (url: string) => function (target: T, 
  propertyKey: string, descriptor: PropertyDescriptor) {
  let app = <Express>is('App');
  let base = <string>is(target.name.toUpperCase()+'_CONTROLLER');
  if (!app) {
    let deleteQueue = <any[]>is('DELETE_QUEUE') || [];
    deleteQueue.push({url: base+'/'+url, func: target[propertyKey]});
    Easily('DELETE_QUEUE', deleteQueue);
  } else {
    app.delete(url, target[propertyKey]);
  }
}

export const Patch = <T extends {new(...args:any[]):{}}>
  (url: string) => function (target: T, 
  propertyKey: string, descriptor: PropertyDescriptor) {
  let app = <Express>is('App');
  let base = <string>is(target.name.toUpperCase()+'_CONTROLLER');
  if (!app) {
    let patchQueue = <any[]>is('PATCH_QUEUE') || [];
    patchQueue.push({url: base+'/'+url, func: target[propertyKey]});
    Easily('PATCH_QUEUE', patchQueue); 
  } else {
    app.patch(url, target[propertyKey]);
  }
}
