import { comparePassword } from '../core';
import { Routes, PassportConfig } from '../config';
import { initialize, session, serializeUser, deserializeUser, use } from 'passport';
import { Connection, FindConditions, Repository } from "typeorm";
import { from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

export class passportConfigurer <T> {
  private _connection: Promise<Connection>;
  private _type: (new(...args:any[])=>T);
  private _localparam: string | string[];
  private _facebookParam: string;
  private _passwordField: string;
  private _facebookCreateMethod: Function;
  private _googleParam: string;
  private _googleCreateMethod: Function;

  public set localparam (param: string | string[]) {
    this._localparam = param;
  }

  public set facebookParam (param: string) {
    this._facebookParam = param;
  }

  public set passwordField (field: string) {
    this._passwordField = field;
  }
  
  public set facebookCreateMethod (method: Function) {
    this._facebookCreateMethod = method;
  }

  public set googleParam (param: string) {
    this._googleParam = param;
  }

  public set googleCreateMethod (method: Function) {
    this._googleCreateMethod = method;
  }

  constructor (connection: Promise<Connection>,
    type: (new(...args:any[])=>T)) {
    this._connection = connection;
    this._type = type;
  }

  public localAuth (username, password, done) {
    let local = <string[]>this._localparam;
    from(this._connection.then(conn => conn.getRepository(this._type)))
    .pipe(mergeMap((rep: Repository<T>) => {
      local.map(x => {
        let params = {};
        params[x] = username;
        from(rep.findOne(params));
      })
      return local;
    })).pipe(map((user: T) => user))
    .subscribe((user: T) => {
      if (user)
        comparePassword(password, user[this._passwordField], done);
      else
        done(new Error('User not found'), user);
    },
      err => done(err, undefined)
    );
  }

  public facebookAuth (req: any, accessToken, 
    refreshToken, profile, done) {
    const params = {};
    params[this._facebookParam] = profile.id;
    from(this._connection.then(conn => conn.getRepository(this._type)
    .findOne(params))).subscribe(
      user => {
        if (user) {
          this._facebookCreateMethod(user);
          done(undefined, user);
        }
        const data = new this._type();
        this._facebookCreateMethod(data);
        this._connection.then(conn => conn.getRepository(this._type).save(<any>data))
        .then(() => done(undefined, data))
        .catch(err => done(err, data));
      });
  }

  public googleAuth (req: any, accessToken, 
    refreshToken, profile, done) {
    const params = {};
    params[this._googleParam] = profile.id;
    from(this._connection.then(conn => conn.getRepository(this._type)
    .findOne(params))).subscribe(
      user => {
        if (user) {
          this._googleCreateMethod(user);
          done(undefined, user);
        }
        const data = new this._type();
        this._googleCreateMethod(data);
        this._connection.then(conn => conn.getRepository(this._type).save(<any>data))
        .then(() => done(undefined, data))
        .catch(err => done(err, data));
      });
  }
}
