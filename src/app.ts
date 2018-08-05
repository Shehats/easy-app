import * as Express from 'express';
import { EasySingleton, is, Easily } from 'easy-injectionjs';
import * as compression from "compression";  // compresses requests
import session from "express-session";
import * as bodyParser from "body-parser";
import * as lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import * as flash from "express-flash";
import mongoose from "mongoose";
import * as errorhandler from 'errorhandler';
import bluebird from 'bluebird';
import { EasyModel } from './model';

export interface AppConfig {
  mongoUrl?: String
}

export class App {
  constructor (config?: AppConfig) {
    const app = Express()
    if (config && config.mongoUrl) {
      const MongoStore = mongo(session)
      (<any> mongoose).Promise = bluebird;
      mongoose.connect(config.mongoUrl, {useMongoClient: true})
      .catch(err => {
        console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
      });

      app.use(session({
        resave: true,
        saveUninitialized: true,
        // secret: SESSION_SECRET,
        store: new MongoStore({
          url: config.mongoUrl,
          autoReconnect: true
        })
      }));
    }

    app.set("port", 3000)
    app.use(compression())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    // app.use(Express.static(path.join(__dirname, 'dist')));
    app.use(flash());
    app.use(lusca.xframe("SAMEORIGIN"));
    app.use(lusca.xssProtection(true));
    app.use(errorhandler())
    app.listen(app.get("port"), () => {
      console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
        );
      console.log("  Press CTRL-C to stop\n");
    })
  }
}


export const EasyApp = <T extends {new(...args:any[]):{}}>(name?: string) => function(target: T): any {
  return class extends target {
    constructor (...args: any[]) {
      super();
      let app = new App()
      Easily('App', app)
    }
  }
}

@EasyModel()
class User {
  email: string
  password: string
  passwordResetToken: string
  passwordResetExpires: Date
  facebook: string
}

@EasyApp()
class Application {
}

new Application()

