import Report from "./components/Report";
import Addcart from "./components/Addcart";
import { DEV } from "@/utils/axios";
import * as lib from "../../utils/lib";
import userLib from "../../utils/users";

let { data, success } = userLib.getUserSetting();
// 一般人员不再显示图像异常品添加列表
let isAdmin = DEV || (success && lib.imgAdmin.includes(data.setting.name));
export default () => {
  return (
    <>
      {isAdmin && <Addcart />} <Report />
    </>
  );
};
