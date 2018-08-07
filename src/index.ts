import { EasyApp } from './common/app';
import { EasyModel } from './models/model'

@EasyApp({mongoUrl: 'mongodb://localhost/aya'})
class Application {
}

new Application()

@EasyModel()
class Cur {
  email: string
  password: string
  passwordResetToken: string
  passwordResetExpires: Date
  facebook: string
}

