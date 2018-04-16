import { DEV } from "../../../utils/axios";
import axios from "axios";

let host = DEV
  ? "http://mactest.cdyc.cbpm:8080/wms/if"
  : "http://mac.cdyc.cbpm:8080/wms/if";
// 本机
// host = "http://10.8.60.202:8080/wms/if";
host = "http://mac.cdyc.cbpm:8080/wms/if";

// 1.批量车号在库查询
// let [carno1,carno2,carno3] = carnos
let getStockStatus = async carnos => {
  let data = await axios({
    method: "post",
    url: host + "/carnoQ",
    data: {
      carnos
    }
  }).then(res => res.data);

  return data;
};

export default { getStockStatus };
