# easy-app
##### An npm package that makes life easier by providing an opinionated approach of web applications in ts-node much like Springboot in Java

##### Currently the package is using TypeOrm, but there is a road map of supporting other Orms.

#### @EasyApp decorator:

##### Example using a mongodb database:

```javascript
@EasyApp({
  databaseType:"mongodb",
  databaseHost:"localhost",
  databaseName:"test",
  databasePort: 27017,
  synchronizeDatabase: true
})
class Application {
}
```
##### And that is it you have a simple Express application.

#### @EasyController decorator:

```javascript
import { EasyController, EasyApp } from 'easy-app';
import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@EasyController()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  email: string
  @Column()
  password: string
}
```
##### And not you have a fully functional Express server with preimplemented '/user' routes, using all of the sterotypical routes for get, post, put, and delete requests out of the box.

##### Creating the Controller using @EasyController without specifying the routes will create the following routes:

##### getUrl: <Class name in lower case> => returns all entries.
  
##### getByIdUrl: <Class name in lower case>/:id => returns entry with the id.
  
##### getByKeyUrl: <Class name in lower case>/:key/:value => returns entries with such key and value.
  
##### postUrl: <Class name in lower case> => adds entry to database
  
##### putUrl: <Class name in lower case>/:id => updates entry with given id.
  
##### deleteUrl: <Class name in lower case>/:id => deletes entry with given id.
  
##### queryUrl: <Class name in lower case>?=:querystring => returns entities that matches the query. Can add multiple queries by +.

##### So for User class:

GET 'domainname/user/' => returns all users.

GET 'domainname/user/1'=> returns user with id 1.

GET 'domainname/user/name/sal' => returns all users with name = sal.

POST 'domainname/user' => adds user in the request body to database.

PUT 'domainname/user/1' => updates user of id 1.

DELETE 'domainname/user/1' => deletes user of id 1.

GET 'domainname/user?=name=sal+age=23' => returns users with name sal and age 23.

#### You can set up your custom routes and they'll work the same:

```javascript
@EasyController({
  getUrl: <custom url>,
  getByIdUrl: <custom url>,
  getByKeyUrl: <custom url>,
  postUrl: <custom url>,
  putUrl: <custom url>,
  deleteUrl: <custom url>,
  queryUrl: <custom url>
})
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  email: string
  @Column()
  password: string
}
```
#### The package supports passport.js. As of now the package supports passport-local, passport-facebook and passport-google
#### Authenication Controller:

##### Using passport-local to authenticate user username or email. keys are the parameters used to authenticate, name is the type of passport for passport-local is local. keys can be a string like 'username' or 'email' aswell.

```javascript
@EasyAuthController([{
  strategy: passportLocal.Strategy,
  params: { usernameField: 'email'},
  keys: ['username', 'email'],
  name: 'local'
}]);
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  email: string
  @Column()
  username: string
  @Column()
  password: string
}
```

##### Using passport-facebook also the same works for passport-google.

```javascript
const createFB = (user) => {/*do smth with user */}
@EasyAuthController([{
  strategy: passportFacebook.Strategy,
  params: {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["name", "email", "link", "locale", "timezone"],
    passReqToCallback: true},
    createFunc: createFB,
    keys: 'facebook',
    name: 'facebook'
}])
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  email: string
  @Column()
  username: string
  @PasswordField
  @Column()
  password: string
}
```
##### You can also use multiple passports:

```javascript

const createFB = (user) => {/*do smth with user */}
@EasyAuthController([{
    strategy: passportLocal.Strategy,
    params: { usernameField: 'email'},
    keys: ['username', 'email'],
    name: 'local'
  },
  {
  strategy: passportFacebook.Strategy,
  params: {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["name", "email", "link", "locale", "timezone"],
    passReqToCallback: true},
    createFunc: createFB,
    keys: 'facebook',
    name: 'facebook'
}])
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  email: string
  @Column()
  username: string
  @PasswordField()
  @Column()
  password: string
}
```

### The package also supports custom controllers and custom middleware:

#### Custom Controller:
```javascript
import { CustomController, Get, Post, Put, Patch, Delete } from 'easy-app';
import { Request, Response, NextFunction } from 'express'

class StormBreakerController {
  constructor () {}

  @Get('lightingStroms')
  getStrom(req: Request, res: Response, next: NextFunction) {
    /** Do fun stuff */
  }
  @Post('lightingStroms')
  postStrom(req: Request, res: Response, next: NextFunction) {
    /** Do fun stuff */
  }
  @Put('lightingStroms')
  putStrom(req: Request, res: Response, next: NextFunction) {
    /** Do fun stuff */
  }
  @Delete('lightingStroms')
  deleteStrom(req: Request, res: Response, next: NextFunction) {
    /** Do fun stuff */
  }
  @Patch('lightingStroms')
  patchStrom(req: Request, res: Response, next: NextFunction) {
    /** Do fun stuff */
  }
}
```

The routes will be 'domainname/lightingStroms'

#### You can also have a main router:

```javascript
import { CustomController, Get, Post, Put, Patch, Delete } from 'easy-app';
import { Request, Response, NextFunction } from 'express'
@CustomController('storms')
class StormBreakerController {
  constructor () {}

  @Get('lightingStroms')
  getStrom(req: Request, res: Response, next: NextFunction) {
    /** Do fun stuff */
  }
  @Post('lightingStroms')
  postStrom(req: Request, res: Response, next: NextFunction) {
    /** Do fun stuff */
  }
  @Put('lightingStroms')
  putStrom(req: Request, res: Response, next: NextFunction) {
    /** Do fun stuff */
  }
  @Delete('lightingStroms')
  deleteStrom(req: Request, res: Response, next: NextFunction) {
    /** Do fun stuff */
  }
  @Patch('lightingStroms')
  patchStrom(req: Request, res: Response, next: NextFunction) {
    /** Do fun stuff */
  }
}

```
the routes will be 'domainname/storms/lightingStroms'


### You can also get instance of the express App:

```javascript
  getApp();
```

### You can just use a middleware at any point:

```javascript
Use(<new MiddleWare()>);
```
