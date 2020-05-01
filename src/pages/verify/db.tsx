import { axios, mock } from "@/utils/axios";

let DEV = true;

/**
 *   @database: { 全幅面 }
 *   @desc:     { 票面实废图像信息查询 }
 */
export const getQfmWipJobs = cart =>
  DEV
    ? mock(require("./qfmwipjob.json"))
    : axios({
        url: "/438/49a52af747.json",
        params: {
          cart,
          blob: "image",
          cache: 5
        }
      });
/**
 *   @database: { 小张核查 }
 *   @desc:     { 丝印实废图像信息查询 }
 */
export const getWipJobs = cart =>
  DEV
    ? mock(require("./wipjobs.json"))
    : axios({
        url: "/439/e6ccdf08a7.json",
        params: {
          cart,
          blob: "image",
          cache: 5
        }
      });

export const getFormatpos = cart => mock(require("./row.json"));
