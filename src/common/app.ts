import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { EasyModel } from '../models/model';
import { Router } from "express";
import * as express from 'express'
import * as compression  from "compression";  // compresses requests
import * as ExpressSession from "express-session";
import * as bodyParser  from "body-parser";
import * as lusca from "lusca";
import * as dotenv  from "dotenv";
import { createConnection, ConnectionOptions} from "typeorm";

export interface AppConfig {
  port?: number,
  appSecret?: string,
  databaseType?: string,
  databaseHost?: string,
  databasePort?: number,
  databaseUsername?: string,
  databasePassword?: string,
  databaseName?: string,
  synchronizeDatabase?: boolean,
  modelsDir?: string[]
}

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
  }

  public get App() : any {
    return this.app
  }
  public get Router(): Router {
    return this.router
  }
}


export const EasyApp = <T extends {new(...args:any[]):{}}>(
  config: AppConfig) => function(target: T): any {
  config.modelsDir.map(x => __dirname+x+'/*.js')
  let options: ConnectionOptions = {
    type: config.databaseType,
    host: config.databaseHost,
    port: config.databasePort,
    username: config.databaseUsername,
    password: config.databasePassword,
    database: config.databaseName,
    entities: config.modelsDir,
    synchronize: config.synchronizeDatabase
  }
  let getConnection = async (opts: ConnectionOptions) => await createConnection(opts)
  return class extends target {
    constructor (...args: any[]) {
      super();
      let app = new App(config)
      Easily('App', app.App)
      Easily('Router', app.Router)
      
    }
  }
}
