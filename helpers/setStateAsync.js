export default async (that, func) =>
  await new Promise(resolve => that.setState(func, resolve));
