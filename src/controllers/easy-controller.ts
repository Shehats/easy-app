import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { Controller } from './base-controller';
import { Routes } from '../core';
import { Express, Router } from "express";
import { Connection } from "typeorm";

export const EasyController = <T extends {new(...args:any[]):{}}>(routes?: Routes) => function(target: T): any {
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
  // init controllers
  let queries = <any[]>((is('Models'))? is('Models'): [])
  queries.push(target)
  Easily('Models', queries)
  Easily(target.name.toLowerCase()+'_MODEL',target)
  let app: Express = <Express> is('App')
  if (!app){
    let queue = <any[]>is('Queue')
    if (!queue)
      Easily('Queue',[{routes: targetRoutes, target: target}])
    else {
      queue.push({routes: targetRoutes, target: target})
      Easily('Queue', queue)
    }
  } else {
    const targetController = new Controller(app, targetRoutes, connection, target)
    Easily(target.name+'_Controller', targetController)
  }
}
