import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { AuthController } from './auth-controller';
import { Express, Router } from "express";
import { Connection } from "typeorm";
import { PassportConfig, Routes} from '../config';

export const EasyAuthController = <T extends {new(...args:any[]):{}}>(strategiesConfig: PassportConfig[]
  , routes?: Routes) => function(target: T): any {
  let connection: Promise<Connection> = <Promise<Connection>>is('Connection')
  const targetRoutes: Routes = (routes) 
                    ? routes
                    : {
                      getUrl: target.name.toLowerCase(),
                      getByIdUrl: target.name.toLowerCase(),
                      getByKeyUrl: target.name.toLowerCase(),
                      postUrl: target.name.toLowerCase(),
                      putUrl: target.name.toLowerCase(),
                      deleteUrl: target.name.toLowerCase(),
                      loginUrl: 'login',
                      registerUrl: 'register'
                    } 
  // init controllers
  let queries = <any[]>((is('Models'))? is('Models'): []);
  queries.push(target);
  Easily('Models', queries);
  Easily(target.name.toLowerCase()+'_MODEL',target);
  let app: Express = <Express> is('App');
  if (!app){
    let queue = <any[]>is('AuthQueue');
    if (!queue)
      Easily('AuthQueue',[{routes: targetRoutes, target: target, config: strategiesConfig}]);
    else {
      queue.push({routes: targetRoutes, target: target, config: strategiesConfig});
      Easily('AuthQueue', queue);
    }
  } else {
    const targetController = new AuthController(app, targetRoutes, connection, target, strategiesConfig);
    Easily(target.name+'_Controller', targetController);
  }
}
