import { createConnection, ConnectionOptions, Connection } from "typeorm";
import { Controller } from '../controllers';
import { App, AppConfig } from './'
import { Routes } from '../core';
import { EasySingleton, is, Easily } from 'easy-injectionjs';

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
  let queue = <any[]>is('Queue')
  if (queue) {
    queue.forEach(x => {
      Easily(target.name+'_Controller', new Controller(app.App, x['routes'], connection, x['target']))
    })
  }
}

