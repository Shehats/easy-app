import { is, Easily } from 'easy-injectionjs';
import { Express } from 'express';

export const Get = (url: string) => function (target: any, 
  propertyKey: string, descriptor: PropertyDescriptor) {
  let app = <Express>is('App');
  if (!app) {
    let getQueue = <any[]>is('GET_QUEUE') || [];
    getQueue.push({url: url, func: target[propertyKey]});
    Easily('GET_QUEUE', getQueue);
  } else {
    app.get(url, target[propertyKey]);
  }
}

export const Post = (url: string) => function (target: any, 
  propertyKey: string, descriptor: PropertyDescriptor) {
  let app = <Express>is('App');
  if (!app) {
    let postQueue = <any[]>is('POST_QUEUE') || [];
    postQueue.push({url: url, func: target[propertyKey]});
    Easily('POST_QUEUE', postQueue);
  } else {
    app.post(url, target[propertyKey])
  }
}

export const Put = (url: string) => function (target: any, 
  propertyKey: string, descriptor: PropertyDescriptor) {
  let app = <Express>is('App');
  if (!app) {
    let putQueue = <any[]>is('PUT_QUEUE') || [];
    putQueue.push({url: url, func: target[propertyKey]});
    Easily('PUT_QUEUE', putQueue);
  } else {
    app.put(url, target[propertyKey]);
  }
}

export const Delete = (url: string) => function (target: any, 
  propertyKey: string, descriptor: PropertyDescriptor) {
  let app = <Express>is('App');
  if (!app) {
    let deleteQueue = <any[]>is('DELETE_QUEUE') || [];
    deleteQueue.push({url: url, func: target[propertyKey]});
    Easily('DELETE_QUEUE', deleteQueue);
  } else {
    app.delete(url, target[propertyKey]);
  }
}

export const Patch = (url: string) => function (target: any, 
  propertyKey: string, descriptor: PropertyDescriptor) {
  let app = <Express>is('App');
  if (!app) {
    let patchQueue = <any[]>is('PATCH_QUEUE') || [];
    patchQueue.push({url: url, func: target[propertyKey]});
    Easily('PATCH_QUEUE', patchQueue); 
  } else {
    app.patch(url, target[propertyKey]);
  }
}
