import { compare, genSalt, hash } from "bcrypt-nodejs";

export const comparePassword = (candidatePassword, password, callBack) => {
  compare(candidatePassword, password, (err: Error, isMatch: boolean) => {
    callBack(err, isMatch);
  });
};

export const encrypt = (len, password, errorFunc, successFunc) => {
  genSalt(len, (err, salt) => {
    if (err)
      return errorFunc(err);
    hash(password, salt, undefined, 
      (err: Error, hashStr) => {
        if (err)
          return errorFunc(err);
        return successFunc(hashStr);
      })
  });
};