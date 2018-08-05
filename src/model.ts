import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { Document, Schema, Model, model} from "mongoose";

export const EasyModel = <T extends {new(...args:any[]):{}}>() => function(target: T): any {
	const targetDocument = class extends target implements Document {}
  const targetSchema = new Schema(target)
  const targetModel = model(target.name, targetSchema)
  Easily(target.name+'_MODEL', targetModel)
  Easily(target.name+'_DOCUMENT', targetDocument)
}
