// 导出数据，随机时长
export type MockFn = <T>(path: T, time?: number) => Promise<T>;
export const mock: MockFn = (path, time = Math.random() * 1000) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(path);
    }, time);
  });

export const mockData: <T>(data: T, time?: number) => Promise<T> = (
  data,
  time = Math.random() * 1000
) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, time);
  });
