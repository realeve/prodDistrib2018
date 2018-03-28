import { notification, Icon } from "antd";
import router from "umi/router";

export default {
  onError(err, dispatch) {
    err.preventDefault();
    let { data } = err.response;
    data.url = err.config.url;
    notification.open({
      message: "错误提示",
      description: `${
        Reflect.has(data, "token") ? data.token : err.message
      } \n\rurl:${data.url}`,
      icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
    });

    if (data.status === 401) {
      console.log(data);
      router.push("/500");
    } else {
      throw err;
    }
  }
};
