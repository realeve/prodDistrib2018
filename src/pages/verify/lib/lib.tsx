import * as R from "ramda";
import * as lib from "@/utils/lib";
import { heatmap } from "./heatmap";
export let getDataByIdx: ({ key: string, data: any }) => Array<any> = ({
  key,
  data
}) => R.pluck(key)(data);

export let getUniqByIdx: ({ key: string, data: any }) => Array<any> = ({
  key,
  data
}) =>
  R.uniq(
    getDataByIdx({
      key,
      data
    })
  );

export let getDataByKeys = ({ keys, data }) => {
  let _data = R.project(keys)(data);
  return R.map(R.values)(_data);
};

// 处理minmax值至最佳刻度，需要考虑 >10 及 <10 两种场景以及负数的情况
export let handleMinMax: (params: {
  min: number;
  max: number;
}) => {
  min: number;
  max: number;
} = ({ min, max }) => {
  let exLength: number = String(Math.floor(max)).length - 1;
  if (max > 10) {
    return {
      max: Math.ceil(max / 10 ** exLength) * 10 ** exLength,
      min: min - (min % 10 ** exLength)
    };
  }
  return {
    max: Math.ceil(max / 1) * 1,
    min: min > 0 ? min - (min % 1) : Math.floor(min / 1) * 1
  };
};

let getLegendData: <T>(
  arr: Array<T>
) => Array<{
  icon: string;
  name: T;
}> = legendData =>
  legendData.map(name => ({
    name,
    icon: "circle"
  }));

export let getLegend: (
  params: any,
  selectedMode?: string
) => {
  show?: boolean;
  selectedMode?: string;
  data?: any;
} = ({ data, legend }, selectedMode = "single") => {
  if (R.isNil(legend)) {
    return {
      show: false
    };
  }
  let key: string = data.header[legend];
  let legendData = getUniqByIdx({
    key,
    data: data.data
  });
  return {
    selectedMode,
    data: getLegendData(legendData)
  };
};

/**
 *
 * @param param0 col:列,row:行,cart:车号
 * @return 对应小开数
 */
export interface PositionCfg {
  col: number;
  row: number;
  maxPaper: number;
}
export const getPosByRowAndCol: (param: PositionCfg) => number = ({
  col,
  row,
  maxPaper
}) => {
  let maxCol: number = 5;
  let maxRow: number = maxPaper === 40 ? 8 : 7;

  let curCol = maxCol - col - 1;
  let curRow = maxRow - row;
  return curCol * maxRow + curRow;
};

/**
 * 根据车号返回对应品种单张小开数
 * @param carts:string 车号
 * @return number:最大开数
 */
export const getMaxPapersByCarts: (carts: string) => number = carts => {
  let prodid: string = carts[2];
  if ([0, 4, 5, 6, 7, 8].includes(Number(prodid))) {
    return 35;
  }
  return 40;
};

let getCopyRight = () => ({
  text: "©" + "成都印钞有限公司",
  borderColor: "#999",
  borderWidth: 0,
  textStyle: {
    fontSize: 13,
    fontWeight: "normal"
  },
  x: "right",
  y2: 3
});

let getDefaultTitle = (option, config, showDateRange: boolean = true) => {
  let prefix = config.prefix || "",
    suffix = config.suffix || "";
  if (option.title) {
    if (!showDateRange) {
      option.title = R.reject(
        item => item.text && item.text.includes("统计时间")
      )(option.title);
    }
  }
  return (
    option.title || [
      {
        left: "center",
        text: prefix + config.data.title + suffix,
        y: 0
      },
      {
        text: config.data.source,
        borderWidth: 0,
        textStyle: {
          fontSize: 11,
          fontWeight: "normal"
        },
        x: 5,
        y2: 0
      },
      {
        text: `统计时间：${config.dateRange[0]} - ${config.dateRange[1]}`,
        borderWidth: 0,
        textStyle: {
          fontSize: 11,
          fontWeight: "normal"
        },
        x: 5,
        y2: 18,
        show: showDateRange
      },
      getCopyRight()
    ]
  );
};

let handleDefaultOption = (option, config, showDateRange = true) => {
  let renderer = "svg";
  let toolbox = option.toolbox || {
    feature: {
      dataZoom: {},
      magicType: {
        type: ["line", "bar", "stack", "tiled"]
      }
    }
  };
  toolbox = Object.assign(toolbox, {
    feature: {
      saveAsImage: {
        type: renderer === "svg" ? "svg" : "png"
      }
    }
  });

  let defaultLegend = {
    type: "scroll",
    width: 500,
    align: "right",
    textStyle: {
      color: "#666"
    }
  };

  if (R.isNil(option.legend)) {
    option.legend = defaultLegend;
  }

  option = Object.assign(
    {
      toolbox,
      tooltip: {},
      legend: defaultLegend,
      title: getDefaultTitle(option, config, showDateRange)
    },
    option
  );

  if (["bar", "line"].includes(config.type)) {
    let axisPointerType: "shadow" | "cross" = "shadow";
    let tooltipTrigger: string = "axis";
    switch (config.type) {
      case "bar":
        // case "histogram":
        axisPointerType = "shadow";
        break;
      case "line":
      default:
        axisPointerType = "cross";
        break;
      // default:
      //   tooltipTrigger = 'item';
      //   axisPointerType = 'cross';
      // break;
    }
    let title = (config.data || {}).title;
    let unit: boolean | string = false;
    let res = title.match(/\((\S+)\)/);
    if (res && res[1]) {
      unit = `<div style="margin-bottom:5px;display:block;">(单位:${res[1]})</div>`;
    }
  }

  return option;
};

export const getOption = ({ dataSrc, params }) => {
  let { tstart, tend } = params;
  if (dataSrc.rows) {
    // 根据地址栏参数顺序决定图表配置顺序
    let config = R.clone(params);
    config = Object.assign(config, {
      data: dataSrc,
      dateRange: [tstart, tend]
    });
    let { type } = config;
    type = type || "bar";

    const opt = dataSrc.data.length === 0 ? {} : heatmap(config);
    const showDateRange = dataSrc.dates && dataSrc.dates.length > 0;
    return handleDefaultOption(opt, config, showDateRange);
  }

  return {
    tooltip: {},
    xAxis: {
      type: "category"
    },
    yAxis: {
      type: "value"
    },
    series: []
  };
};

export const getDrivedState = ({ dataSrc, params }) => {
  let option = [];
  let groupList = [];
  if (params.group) {
    let param = params.group;
    if (lib.isInt(param)) {
      param = R.nth(param, dataSrc.header);
    }

    let dataList = R.groupBy(R.prop(param))(dataSrc.data);

    // 分组列表
    groupList = R.keys(dataList);

    option = R.compose(
      R.map(prefix => {
        let newParam = R.clone(params);
        let newDataSrc = R.clone(dataSrc);
        newDataSrc.data = dataList[prefix];
        if (!params.prefix) {
          newParam.prefix = prefix;
        }
        return getOption({
          dataSrc: newDataSrc,
          params: newParam
        });
      }),
      R.keys
    )(dataList);
  } else {
    option = [
      getOption({
        dataSrc,
        params
      })
    ];
  }
  return option[0];
};
