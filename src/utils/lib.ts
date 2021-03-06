import moment from "moment";
import { host, uploadHost } from "./axios";
import http from "axios";
const R = require("ramda");

export const searchUrl: string = "http://10.8.2.133:8000/search#";
export const imgUrl: string = "http://10.8.2.133:8000/search/image#";
export const adminUserList: Array<string> = ["钟鸣", "李宾"];
export const imgAdmin: Array<string> = ["邓玉红"];

export const packageAdmin: Array<string> = ["母霞", "张蓉萍", "李宾"];

export const apiHost: string = host;

interface Rules {
  cart: any;
  reel: any;
}
const rules: Rules = {
  cart: /^[0-9]\d{3}[A-Za-z]\d{3}(|[a-bA-B])$/,
  reel: /^[0-9]\d{6}([A-Ca-c]|)$|[A-Z]\d{11}([A-Z]|)|^\d{3}[A-Z]\d{5}(|[A-Z])$/
};

interface CartReelReg {
  (str: string | number): boolean;
}

export const isCartOrReel: CartReelReg = str => {
  return (
    rules.cart.test(String(str).trim()) || rules.reel.test(String(str).trim())
  );
};

export const isCart: CartReelReg = str => rules.cart.test(String(str).trim());
export const isReel: CartReelReg = str => rules.reel.test(String(str).trim());

export const isDateTime: CartReelReg = str =>
  /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$|^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d [0-2][0-9]:[0-5][0-9](:[0-5][0-9])$|^[0-2][0-9]:[0-5][0-9](:[0-5][0-9])$/.test(
    String(str).trim()
  );

export const isNumOrFloat: CartReelReg = str =>
  /^\d+(\.)\d+$|^\d+$/.test(String(str));
export const isInt: CartReelReg = str => /^\d+$/.test(String(str));
export const isFloat: CartReelReg = str => /^\d+\.\d+$|^\d+$/.test(String(str));

export const now = () => moment().format("YYYY-MM-DD HH:mm:ss");
export const weeks = () => moment().weeks();

export const ymd = () => moment().format("YYYYMMDD");

interface lastAlpha {
  (str: string): string;
}
let getLastAlpha: lastAlpha = str => {
  if (str === "A") {
    return "Z";
  }
  let c: number = str.charCodeAt(0);
  return String.fromCharCode(c - 1);
};

// 处理冠字信息
/**
 *
 * @param {code,prod} 号码，品种
 */
interface GZSetting {
  code: string;
  prod: string;
}
interface GZInfo {
  start: string;
  end: string;
  start2: string;
  end2: string;
  alpha: string;
  alpha2: string;
}
interface hdGZInfo {
  ({ code, prod }: GZSetting): GZInfo | boolean;
}
export const handleGZInfo: hdGZInfo = ({ code, prod }) => {
  if (code.length !== 6) {
    return false;
  }
  let kInfo: number = 35;
  if (prod.includes("9602") || prod.includes("9603")) {
    kInfo = 40;
  }

  console.log(code);

  let alphaInfo: Array<string> = code.match(/[A-Z]/g);
  let numInfo: string = code.match(/\d/g).join("");
  let starNum: number = code.slice(1, 6).indexOf(alphaInfo[1]) + 1;
  let starInfo: string = code
    .slice(1, starNum)
    .split("")
    .fill("*")
    .join("");
  let start: number = parseInt(numInfo, 10) - kInfo;

  let end: string = numInfo;
  let needConvert: boolean = start < 0;
  let start2: string = String(start + 1),
    end2: string = end;

  let alpha: string = alphaInfo[0] + starInfo + alphaInfo[1];
  let alpha2: string = alpha;

  if (needConvert) {
    start = 10000 + start;
    end = "9999";
    start2 = "0000";
    end2 = numInfo;
    // 字母进位
    let [a1, a2] = alphaInfo;
    if (a2 === "A") {
      a1 = getLastAlpha(a1);
      a2 = getLastAlpha(a2);
    } else {
      a2 = getLastAlpha(a2);
    }
    alpha = a1 + starInfo + a2;
  }
  start += 1;

  // start = '000' + start;
  // start = start.slice(start.length - 4, start.length);
  const startStr: string = String(start).padStart(4, "0");

  return {
    start: startStr,
    end,
    start2,
    end2,
    alpha,
    alpha2
  };
};

export let isGZ: CartReelReg = value =>
  /^[A-Za-z]{2}\d{4}$|^[A-Za-z]\d[A-Za-z]\d{3}$|^[A-Za-z]\d{2}[A-Za-z]\d{2}$|^[A-Za-z]\d{3}[A-Za-z]\d$|^[A-Za-z]\d{4}[A-Za-z]$/.test(
    String(value)
  );

export let loadFile: {
  (fileName: string, content: any): void;
} = (fileName, content) => {
  var aLink: HTMLAnchorElement = document.createElement("a");
  var blob: Blob = new Blob([content], {
    type: "text/plain"
  });
  // var evt = new Event("click");
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
  URL.revokeObjectURL(aLink.href);
};

let dataURItoBlob = (dataURI: string) => {
  var byteString: string = atob(dataURI.split(",")[1]);
  var mimeString: string = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  var ab: ArrayBuffer = new ArrayBuffer(byteString.length);
  var ia: Uint8Array = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {
    type: mimeString
  });
};

/**
 * wiki: dataURL to blob, ref to https://gist.github.com/fupslot/5015897
 * @param dataURI:base64
 * @returns {FormData}
 * 用法： axios({url,type:'POST',data}).then(res=>res.data);
 */
// 将BASE64编码图像转为FormData供数据上传，用法见上方注释。
export let dataURI2FormData: {
  (dataURI: string): FormData;
} = dataURI => {
  var data: FormData = new FormData();
  var blob: Blob = dataURItoBlob(dataURI);
  data.append("file", blob);
  return data;
};

/**
 * @功能：将base64字符串上传至服务器同时保存为文件，返回文件信息及attach_id
 * @param {base64字符串} datURI
 * @return {
 *      status:bool,//上传状态
 *      id:int,//文件id
 *      fileInfo:object // 文件描述：宽、高、url、大小、类型、名称
 * }
 */
export let uploadBase64 = async (dataURI: string) => {
  var data: FormData = dataURI2FormData(dataURI);
  return await http({
    method: "POST",
    url: uploadHost,
    data
  }).then(res => res.data);
};

/**
 *
 * @param {file文件对象，input type="file"} file
 * @param {回调函数} callback
 * @desc 将file图像文件对象转换为BASE64
 */
export let dataFile2URI = async (file: File, callback: Function) => {
  if (typeof FileReader === "undefined") {
    return {
      status: false,
      data: "浏览器不支持 FileReader"
    };
  }
  if (!/image\/\w+/.test(file.type)) {
    //判断获取的是否为图片文件
    return {
      status: false,
      data: "浏览器不支持 请确保文件为图像文件"
    };
  }
  var reader: FileReader = new FileReader();
  reader.onload = ({ target: { result } }: any) => {
    if (typeof callback === "function") {
      callback(result);
    }
  };
  reader.readAsDataURL(file);
  return reader;
};

export const getType: {
  (o: any): string;
} = o =>
  Object.prototype.toString
    .call(o)
    .match(/\w+/g)[1]
    .toLowerCase();

interface Store {
  payload: { any };
}
export const setStore = (state, { payload }: Store) => {
  let nextState = R.clone(state);
  Object.keys(payload).forEach(key => {
    let val = payload[key];
    // console.log(key, val);
    if (getType(val) == "object") {
      nextState[key] = Object.assign({}, nextState[key], val);
    } else {
      nextState[key] = val;
    }
  });
  return nextState;
};
