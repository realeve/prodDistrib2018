import moment from "moment";
import { host } from "./axios";

export const searchUrl = "http://10.8.2.133/search#";
export const apiHost = host;
export const isCartOrReel = str => {
  const rules = {
    cart: /^[1-9]\d{3}[A-Za-z]\d{3}$/,
    reel: /^[1-9]\d{6}[A-Ca-c]$|^[1-9]\d{4}$|^[1-9]\d{4}[A-Ca-c]$|^[1-9]\d{6}$|[A-Z]\d{11}[A-Z]/
  };
  return rules.cart.test(str) || rules.reel.test(str);
};

export const isDateTime = str =>
  /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$|^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d [0-2][0-9]:[0-5][0-9](:[0-5][0-9])$|^[0-2][0-9]:[0-5][0-9](:[0-5][0-9])$/.test(
    str
  );
export const isNumOrFloat = str => /^\d+(\.)\d+$|^\d+$/.test(str);
export const isInt = str => /^\d+$/.test(str);
export const isFloat = str => /^\d+\.\d+$|^\d+$/.test(str);

export const now = () => moment().format("YYYY-MM-DD HH:mm:ss");
export const weeks = () => moment().weeks();

export const ymd = () => moment().format("YYYYMMDD");

let getLastAlpha = str => {
  if (str === "A") {
    return "Z";
  }
  let c = str.charCodeAt();
  return String.fromCharCode(c - 1);
};

// 处理冠字信息
/**
 *
 * @param {code,prod} 号码，品种
 */
export const handleGZInfo = ({ code, prod }) => {
  if (code.length !== 6) {
    return false;
  }
  let kInfo = 35;
  if (prod.includes("9602") || prod.includes("9603")) {
    kInfo = 40;
  }

  let alphaInfo = code.match(/[A-Z]/g);
  let numInfo = code.match(/\d/g).join("");
  let starNum = code.slice(1, 6).indexOf(alphaInfo[1]) + 1;
  let starInfo = code
    .slice(1, starNum)
    .split("")
    .fill("*")
    .join("");
  let start = parseInt(numInfo, 10) - kInfo;

  let end = numInfo;
  let needConvert = start < 0;
  let start2 = start + 1,
    end2 = end;

  let alpha = alphaInfo[0] + starInfo + alphaInfo[1];
  let alpha2 = alpha;

  if (needConvert) {
    start += 10000;
    end = 9999;
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

  start = "000" + start;
  start = start.slice(start.length - 4, start.length);

  return {
    start,
    end,
    start2,
    end2,
    alpha,
    alpha2
  };
};

export let isGZ = value =>
  /^[A-Za-z]{2}\d{4}$|^[A-Za-z]\d[A-Za-z]\d{3}$|^[A-Za-z]\d{2}[A-Za-z]\d{2}$|^[A-Za-z]\d{3}[A-Za-z]\d$|^[A-Za-z]\d{4}[A-Za-z]$/.test(
    value
  );
