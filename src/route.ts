import { Document, Schema, Model, model} from "mongoose";
import { Response, Request, NextFunction, Express } from "express";

interface Routes {
  getUrl?: String,
  getByIdUrl?: String,
  getByKeyUrl?: String,
  postUrl?: String,
  putUrl?: String,
  deleteUrl?: String
}

class Controller {
  constructor (app: Express, 
               routes: Routes,
               model: Model,
               type: (new(...args:any[]) => {})) {
    app.get(`/${routes.getUrl}`, (req: Request, res: Response) => {
      model.find((err, arr) => (err)
        ? res.status(404).send(err)
        : res.status(200).json(arr))
    })

    app.get(`/${routes.getByIdUrl}/:id`, (req: Request, res: Response) => {
      model.findById(req.params.id, (err, data) => (err)
        ? res.status(404).send(err)
        : res.status(200).json(data))
    })

    app.post(`/${routes.getByIdUrl}/:id`, (req: Request, res: Response) => {
      const target = new type()
      Object.getOwnPropertyNames(req.body)
      .forEach(x => {
        target[x] = req.body[x]
      })
      model.save(target, err => (err) 
        ? res.status(403).send(err)
        : res.status(200).json(target))
    })

    app.put(`/${routes.getByIdUrl}/:id`, (req: Request, res: Response) => {
      model.findByIdAndUpdate(req.params.id, 
                              req.body, 
                              {new: true}, 
                              (err, data) => (err)
                              ? res.status(403).send(err)
                              : res.status(200).json(data))
    })

    app.delete(`/${routes.getByIdUrl}/:id`, (req: Request, res: Response) => {
      model.findByIdAndRemove(req.params.id, (err, data) => (err)
         ? res.status(500).send(err)
         : res.status(200).send({'message': 'Item has been successfully deleted.'}))
    })
  }
}