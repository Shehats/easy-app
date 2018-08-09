import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { Router, Response, Request, NextFunction } from "express";
import * as express from 'express'
import * as compression  from "compression";  // compresses requests
import * as ExpressSession from "express-session";
import * as bodyParser  from "body-parser";
import * as lusca from "lusca";
import * as dotenv  from "dotenv";
import { createConnection, ConnectionOptions, Connection } from "typeorm";
import { Controller } from '../controllers';
import { Observable, from, merge } from 'rxjs';
import { Routes } from '../core';
import { AppConfig } from './app-config';

export class App {
  private router: Router
  private app: express.Application

  constructor (config: AppConfig) {
    this.app = express()
    this.router = Router()
    let options: ExpressSession.SessionOptions = {
      resave: true,
      saveUninitialized: true,
      secret: (config.appSecret)
      ? config.appSecret
      : 'SESSION_SECRET'
    }
    this.app.use(<express.RequestHandler> ExpressSession(options));
    this.app.set("port", (config && config.port)? config.port: 3030)
    this.app.use(compression())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(lusca.xframe("SAMEORIGIN"));
    this.app.use(lusca.xssProtection(true));
    this.app.listen(this.app.get("port"), () => {
      console.log(
        "  App is running at http://localhost:%d in %s mode",
        this.app.get("port"),
        this.app.get("env")
        );
      console.log("  Press CTRL-C to stop\n");
    })
    this.app.get('/search?:q=:search', (req: Request, res: Response, next: NextFunction) => {
      let connection: Promise<Connection> = <Promise<Connection>>is('Connection')
      let params: any = (<any>{})
      (<string>req.params.search)
      .split('+').forEach(x => {
        let cur = x.split('=')
        params[cur[0]] = cur[1]
      })
      let q = req.params.q
      if (!q) {
        let queries = (<any[]> is('Models'))
        from(connection.then(conn => queries.map(x => conn.getRepository(x).find(params))))
        .subscribe(
          data => {
            let retVal = []
            data.forEach(x => retVal.concat(x))
            res.status(200).json(retVal)
          },
          err => res.status(500).send(err),
          () => next()
          )
      }
      else {
        from(connection.then(conn => conn.getRepository(is(q+'_MODEL')).find(params)))
        .subscribe(
          data => res.status(200).json(data),
          err => res.status(500).send(err),
          () => next()
          )
      }
    })
  }

  public get App() : any {
    return this.app
  }
  public get Router(): Router {
    return this.router
  }
}
