import { Controller } from './base-controller';
import { Response, Request, NextFunction, Express, Router } from "express";
import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { Connection, FindConditions } from "typeorm";
import { Observable, from } from 'rxjs';
import { Routes, PassportConfig, comparePassword, passportConfigurer } from '../core';
import { initialize, session, serializeUser, deserializeUser, 
        use, authenticate } from 'passport';


export class AuthController<T>{
  constructor (app: Express, 
    routes: Routes,
    connection: Promise<Connection>,
    type: (new(...args:any[])=>T),
    stategies: PassportConfig[]) {
    app.use(initialize());
    app.use(session());
    serializeUser<any, any> ((user, done) => {
      done(undefined, user.id);
    });

    deserializeUser<any, any> ((id, done) => {
      connection.then(conn => conn.getRepository(type).findOne(id))
      .then(data => done(undefined, data))
      .catch(err => done(err, undefined));
    });
    const passport = new passportConfigurer(connection, type);

    const defined = {}
    stategies.forEach(x => {
      use(new x.strategy(x.params, (...args: any[]) => {

      }))
    });

    app.post(`/${routes.loginUrl}`, (req: Request, res: Response, next: NextFunction) => {
      if (!defined['local'])
        return res.status(401).json({message: "Not implemented"});
      authenticate('local', (err: Error, user: T) => {
        if (err)
          return next(err);
        if (!user)
          return res.status(401);
        req.login(user, (err) => {
          return res.status(401);
        });
      })(req, res, next);
    });

    app.post(`/${routes.registerUrl}`, (req: Request, res: Response, next: NextFunction) => {
      
    });
  }
}
