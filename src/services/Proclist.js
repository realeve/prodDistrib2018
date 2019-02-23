import { axios, DEV } from '../utils/axios';

/**
*   @database: { 质量信息系统 }
*   @desc:     { 流转工艺列表 } 
  
*/
export const getPrintNewprocType = () =>
  DEV
    ? require('@/mock/a7835c9ebc.js')
    : axios({
        url: '/87/a7835c9ebc.json'
      });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 印钞品种列表 } 
  
*/
export const getProduct = () =>
  DEV
    ? require('@/mock/0fff65bc40.js')
    : axios({
        url: '/71/0fff65bc40.json'
      });
