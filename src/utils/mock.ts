export const mock = (data: any, time?: number = 2000) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), time);
  });
