import TaskSetting from './components/TaskSetting';

import * as lib from '../../utils/lib';
import userLib from '../../utils/users';

let { data, success } = userLib.getUserSetting();
// 一般人员不再显示图像异常品添加列表
let isAdmin = success && lib.imgAdmin.includes(data.setting.name);
export default () => {
  return <TaskSetting />;
};
