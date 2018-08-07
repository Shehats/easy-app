import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { Document, Schema, Model, model} from "mongoose";
import { Routes, Controller } from '../controllers/base-controller';
import { Express, Router } from "express";

export const EasyModel = <T extends {new(...args:any[]):{}}>(routes?: Routes) => function(target: T): any {
	const targetDocument = class extends target implements Document {}
  const targetSchema = new Schema(target, {versionKey: false})
  const targetModel = model(target.name, )
  Easily(target.name+'_MODEL', targetModel)
  Easily(target.name+'_DOCUMENT', targetDocument)
  const app = <Express> is('App')
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

  const targetController = new Controller(app, targetRoutes, targetModel, target)
  Easily(target.name+'_Controller', targetController)
}
