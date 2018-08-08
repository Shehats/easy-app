import { Response, Request, NextFunction, Express, Router } from "express";
import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { Connection } from "typeorm";
import { Observable, from } from 'rxjs';
import { constructType } from '../util/helpers'

export interface Routes {
  getUrl?: string,
  getByIdUrl?: string,
  getByKeyUrl?: string,
  postUrl?: string,
  putUrl?: string,
  deleteUrl?: string
}

export class Controller<T> {
  constructor (app: Express, 
    routes: Routes,
    connection: Promise<Connection>,
    type: (new(...args:any[])=>T)) {
    app.get(`/${routes.getUrl}`, (req: Request, res: Response, next: NextFunction) => {
      from(connection.then(conn => conn.getRepository(type).find()))
      .subscribe(
        data => res.status(200).json(data),
        err => res.status(500).send(err),
        () => next())
    })

    app.get(`/${routes.getByIdUrl}/:id`, (req: Request, res: Response, next: NextFunction) => {
      from(connection.then(conn => conn.getRepository(type).findOne(req.params.id)))
      .subscribe(
        data => res.status(200).json(data),
        err => res.status(500).send(err),
        () => next())
    })

    app.post(`/${routes.getByIdUrl}`, (req: Request, res: Response, next: NextFunction) => {
      from(connection.then(conn => conn.getRepository(type).save(<any>constructType(req.body, type))))
        .subscribe(
          data => res.status(200).json(data),
          err => res.status(500).send(err),
          () => next())
    })

    app.put(`/${routes.getByIdUrl}/:id`, (req: Request, res: Response, next: NextFunction) => {
      from(connection.then(conn => conn.getRepository(type).update(req.params.id, <any>constructType(req.body, type))))
      .subscribe(
          data => res.status(200).json(data),
          err => res.status(500).send(err),
          () => next())
    })

    app.delete(`/${routes.getByIdUrl}/:id`, (req: Request, res: Response, next: NextFunction) => {
      from(connection.then(conn => conn.getRepository(type).delete(req.params.id)))
      .subscribe(
          data => res.status(200).json(data),
          err => res.status(500).send(err),
          () => next())
    })
  }
}