import { createConnection, ConnectionOptions, Connection } from "typeorm";
import { Controller, AuthController } from '../controllers';
import { App } from './'
import { Routes, AppConfig } from '../config';
import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { Express } from 'express';

export const EasyApp = <T extends {new(...args:any[]):{}}>(
  config: AppConfig) => function(target: T): any {
  let app = new App(config)
  Easily('App', app.App)
  Easily('Router', app.Router)
  let getConnection = async () => await createConnection((<ConnectionOptions>{
    url: config.databaseUrl,
    type: config.databaseType,
    host: config.databaseHost,
    port: config.databasePort,
    username: config.databaseUsername,
    password: config.databasePassword,
    database: config.databaseName,
    entities: (config.modelsDir)? config.modelsDir : is('Models'),
    synchronize: config.synchronizeDatabase
  }))
  let connection = (<Promise<Connection>>getConnection())
  Easily('Connection', connection)
  let queue = <any[]>is('Queue');
  let authQueue = <any[]>is('AuthQueue');
  if (authQueue) {
    authQueue.forEach(x => {
      Easily(target.name+'_Controller', new AuthController(app.App, x['routes'], connection, x['target'], x['config']));
    })
  }
  if (queue) {
    queue.forEach(x => {
      Easily(target.name+'_Controller', new Controller(app.App, x['routes'], connection, x['target']));
    })
  }
  let getQueue = <any[]>is('GET_QUEUE');
  let postQueue = <any[]>is('POST_QUEUE');
  let putQueue = <any[]>is('PUT_QUEUE');
  let deleteQueue = <any[]>is('DELETE_QUEUE');
  let patchQueue = <any[]>is('PATCH_QUEUE');
  getQueue.forEach(x => {
    let base = <string>is(x['parent']);
    console.log((base)? base+x['url']: x['url'])
    app.App.get((base)? base+x['url']: x['url'], x['func'])
  });
  postQueue.forEach(x => {
    let base = <string>is(x['parent']);
    app.App.post((base)? base+x['url']: x['url'], x['func'])
  });
  putQueue.forEach(x => {
    let base = <string>is(x['parent']);
    app.App.put((base)? base+x['url']: x['url'], x['func'])
  });
  deleteQueue.forEach(x => {
    let base = <string>is(x['parent']);
    app.App.delete((base)? base+x['url']: x['url'], x['func'])
  });
  patchQueue.forEach(x => {
    let base = <string>is(x['parent']);
    app.App.patch((base)? base+x['url']: x['url'], x['func'])
  });
}

export const getApp = () => (<Express>is('App'));
export const Use  = (middleware: any) => (<Express>is('App')).use(middleware);
