import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { AuthController } from './auth-controller';
import { Routes } from '../core';
import { Express, Router } from "express";
import { Connection } from "typeorm";
import { PassportConfig } from '../core';

export const EasyAuthController = <T extends {new(...args:any[]):{}}>(strategiesConfig: string|PassportConfig[], useRoutes?: boolean, routes?: Routes) => function(target: T): any {
  let connection: Promise<Connection> = <Promise<Connection>>is('Connection')
  const targetRoutes: Routes = (routes) 
                    ? routes
                    : {
                      getUrl: target.name.toLowerCase(),
                      getByIdUrl: target.name.toLowerCase(),
                      getByKeyUrl: target.name.toLowerCase(),
                      postUrl: target.name.toLowerCase(),
                      putUrl: target.name.toLowerCase(),
                      deleteUrl: target.name.toLowerCase()
                    }
  let curConfig: PassportConfig[] = []
  if (typeof strategiesConfig === "string") {}
  // init controllers
  let queries = <any[]>((is('Models'))? is('Models'): [])
  queries.push(target)
  Easily('Models', queries)
  Easily(target.name.toLowerCase()+'_MODEL',target)
  let app: Express = <Express> is('App')
  if (!app){
    let queue = <any[]>is('AuthQueue')
    if (!queue)
      Easily('AuthQueue',[{routes: targetRoutes, target: target, config: curConfig}])
    else {
      queue.push({routes: targetRoutes, target: target, config: curConfig})
      Easily('AuthQueue', queue)
    }
  } else {
    const targetController = new AuthController(app, targetRoutes, connection, target, curConfig);
    Easily(target.name+'_Controller', targetController);
  }
}
