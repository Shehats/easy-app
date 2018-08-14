import { Controller } from './base-controller';
import { Response, Request, NextFunction, Express, Router } from "express";
import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { Connection, FindConditions } from "typeorm";
import { Observable, from } from 'rxjs';
import { comparePassword, constructType, passportConfigurer } from '../core';
import { Routes, PassportConfig } from '../config';
import { initialize, session, serializeUser, deserializeUser, 
        use, authenticate } from 'passport';
import * as _ from 'lodash';


export class AuthController<T> extends Controller<T>{
  constructor (app: Express, 
    routes: Routes,
    connection: Promise<Connection>,
    type: (new(...args:any[])=>T),
    stategies: PassportConfig[]) {
    super(app, routes, connection, type);
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
      defined[x.name] = x.params;
      if (x.name == 'local') {
        passport.localparam = x.keys;
        passport.passwordField = is(type.name.toUpperCase()+'_PASSWORD');
        use(new x.strategy(x.params, 
          (username, password, done) => 
          passport.localAuth(username, password, done)));        
      } else if (x.name == 'facebook') {
        passport.facebookParam = <string>x.keys;
        passport.facebookCreateMethod = x.createFunc;
        use(new x.strategy(x.params, 
          (req: any, accessToken, refreshToken, profile, done) => 
          passport.facebookAuth(req, accessToken, refreshToken, profile, done)));
      } else if (x.name == 'google') {
        passport.googleParam = <string>x.keys;
        passport.googleCreateMethod = x.createFunc;
        use(new x.strategy(x.params, (req: any, accessToken, refreshToken, profile, done) =>
          passport.googleAuth(req, accessToken, refreshToken, profile, done)))
      }
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
      if (!defined['local'])
        return res.status(503).json({message: "Not implemented"});
      const params = {};
      _.forEach(defined['local'], x => {
        params[x] = req.body[x];        
      });
      from(connection.then(conn => conn.getRepository(type).findOne(params)))
      .subscribe(user => {
        if (user)
          res.status(401).json({message: `${type.name} already exits.`});
        res.redirect(307, `/${routes.postUrl}`),
        err => res.status(500).send(err),
        () => next()
      })
    });
  }
}
