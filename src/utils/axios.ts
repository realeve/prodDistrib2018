import http from 'axios';
import qs from 'qs';
import { getType } from './lib';
export { mock } from './mock';
export let DEV: boolean = true;

export let host: string = DEV
  ? 'http://localhost:90/api/'
  : 'http://10.8.1.25:100/api/';
export let uploadHost: string = DEV
  ? '//localhost/upload/'
  : '//10.8.2.133/upload/';

export const _commonData = {
  rows: 1,
  data: [{ affected_rows: 1, id: Math.ceil(Math.random() * 100) }],
  time: 20,
  ip: '127.0.0.1',
  title: '数据更新/插入/删除返回值'
};
let g_axios = {
  host,
  token: ''
};

interface userInfoType {
  token: string;
}

const loadUserInfo = function(): userInfoType {
  // 业务经办人
  let userInfo = {
    name: '',
    uid: '',
    fullname: '',
    org: ''
  };
  let userStr: string = window.localStorage.getItem('user');
  if (userStr == null) {
    return {
      token: ''
    };
  }
  let user = JSON.parse(userStr);
  g_axios.token = user.token;
  let extraInfo = atob(user.token.split('.')[1]);
  userInfo.uid = JSON.parse(extraInfo).extra.uid;
  return user;
};

let refreshNoncer = async () => {
  // 此时可将引用url链接作为 url 参数请求登录，作为强校验；
  // 本部分涉及用户名和密码，用户需自行在服务端用curl申请得到token，勿放置在前端;
  let url = g_axios.host + 'authorize.json?user=develop&psw=111111';
  return await http.get(url).then((res) => res.data.token);
};

const saveToken = () => {
  window.localStorage.setItem(
    'user',
    JSON.stringify({
      token: g_axios.token
    })
  );
};

// 自动处理token更新，data 序列化等
export let axios = async (option) => {
  if (!g_axios) {
    g_axios = {
      host,
      token: ''
    };
  }
  // token为空时自动获取
  if (g_axios.token === '') {
    let user = loadUserInfo();

    if (typeof user === 'undefined' || user.token === '') {
      g_axios.token = await refreshNoncer();
      saveToken();
    }
  }

  option = Object.assign(option, {
    headers: {
      Authorization: g_axios.token
    },
    method: option.method || 'get'
  });

  return await http
    .create({
      baseURL: g_axios.host,
      timeout: 10000,
      transformRequest: [
        function(data) {
          let dataType = getType(data);
          switch (dataType) {
            case 'object':
            case 'array':
              data = qs.stringify(data);
              break;
            default:
              break;
          }
          return data;
        }
      ]
    })(option)
    .then(({ data }) => {
      // 刷新token
      if (typeof data.token !== 'undefined') {
        g_axios.token = data.token;
        saveToken();
      }
      return data;
    })
    .catch((e) => {
      console.log(e);
      // let req = response.request;
      // let errMsg = `${req.status} ${
      //   req.statusText
      // }<br>数据读取失败<br>错误原因：${req.response.data}`;

      // let { data } = e.response;
      // data.status = req.status;
      // data.statusText = req.statusText;
      // data.errMsg = errMsg;
      return Promise.reject(e);
    });
};
