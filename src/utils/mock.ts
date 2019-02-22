// 导出数据，随机时长
export const mock = (data: any, time: number = Math.random() * 2000) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), time);
  });
