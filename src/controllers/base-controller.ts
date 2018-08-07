import { Document, Schema, Model, model} from "mongoose";
import { Response, Request, NextFunction, Express, Router } from "express";

export interface Routes {
  getUrl?: String,
  getByIdUrl?: String,
  getByKeyUrl?: String,
  postUrl?: String,
  putUrl?: String,
  deleteUrl?: String
}

export class Controller {
  constructor (app: Router, 
    routes: Routes,
    model_: Model,
    type: (new(...args:any[]) => {})) {
    app.get(`/${routes.getUrl}`, (req: Request, res: Response) => {
      model_.find((err, arr) => (err)
        ? res.status(404).send(err)
        : res.status(200).json(arr))
    })

    app.get(`/${routes.getByIdUrl}/:id`, (req: Request, res: Response) => {
      model_.findById(req.params.id, (err, data) => (err)
        ? res.status(404).send(err)
        : res.status(200).json(data))
    })

    app.post(`/${routes.getByIdUrl}`, (req: Request, res: Response) => {
      const target = new model_(req.body)
      target.save(err => (err) 
        ? res.status(403).json(err)
        : res.status(200).json(req.body))
    })

    app.put(`/${routes.getByIdUrl}/:id`, (req: Request, res: Response) => {
      model_.findByIdAndUpdate(req.params.id, 
        req.body, 
        {new: true}, 
        (err, data) => (err)
        ? res.status(403).json(err)
        : res.status(200).json(data))
    })

    app.delete(`/${routes.getByIdUrl}/:id`, (req: Request, res: Response) => {
      model_.findByIdAndRemove(req.params.id, (err, data) => (err)
        ? res.status(500).json(err)
        : res.status(200).json({'message': 'Item has been successfully deleted.'}))
    })
  }
}