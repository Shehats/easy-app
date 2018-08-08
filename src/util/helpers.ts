export const constructType = <T>(data: Object, type: (new(...args:any[])=>T)): T => {
  const retVal: T = new type();
  Object.getOwnPropertyNames(data)
  .forEach(x => {
    retVal[x] = data[x]
  })
  return retVal
}