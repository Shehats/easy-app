import { Response, Request, NextFunction, Express, Router } from "express";
import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { Connection, FindConditions } from "typeorm";
import { Observable, from } from 'rxjs';
import { constructType, Routes } from '../core';

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

    app.get(`/${routes.getByKeyUrl}/:key/:value`, (req: Request, res: Response, next: NextFunction) => {
      let params = {}
      params[req.params.key] = req.params.value
      from(connection.then(conn => conn.getRepository(type).find(params)))
      .subscribe(
          data => res.status(200).json(data),
          err => res.status(500).send(err),
          () => next())

    })

    app.get(`/${routes.queryUrl}=:elem`, (req: Request, res: Response, next: NextFunction) => {
      let params: any = (<any>{})

      (<string>req.params.search)
      .split('+').forEach(x => {
        let cur = x.split('=')
        params[cur[0]] = cur[1]
      })
      from(connection.then(conn => conn.getRepository(type).find(params)))
      .subscribe(
          data => res.status(200).json(data),
          err => res.status(500).send(err),
          () => next())
    })

    app.post(`/${routes.postUrl}`, (req: Request, res: Response, next: NextFunction) => {
      from(connection.then(conn => conn.getRepository(type).save(<any>constructType(req.body, type))))
        .subscribe(
          data => res.status(200).json(data),
          err => res.status(500).send(err),
          () => next())
    })

    app.put(`/${routes.putUrl}/:id`, (req: Request, res: Response, next: NextFunction) => {
      from(connection.then(conn => conn.getRepository(type).update(req.params.id, <any>constructType(req.body, type))))
      .subscribe(
          data => res.status(200).json(data),
          err => res.status(500).send(err),
          () => next())
    })

    app.delete(`/${routes.deleteUrl}/:id`, (req: Request, res: Response, next: NextFunction) => {
      from(connection.then(conn => conn.getRepository(type).delete(req.params.id)))
      .subscribe(
          data => res.status(200).json(data),
          err => res.status(500).send(err),
          () => next())
    })
  }
}