import React, { useEffect, useState, memo } from "react";
import * as db from "./db";
import Chart from "./lib/chart";
import {
  getPosByRowAndCol,
  getMaxPapersByCarts,
  getDrivedState
} from "./lib/lib";
import * as R from "ramda";

const beforeRender = (param, maxPaper) => {
  let { title, toolbox, ...dist } = param;
  dist = Object.assign(dist, {
    grid: {
      x: 25,
      y: 5,
      x2: 10,
      y2: 45
    }
  });
  dist.tooltip.formatter = ({ value: [col, row, val] }) => {
    let curPos = getPosByRowAndCol({ col, row, maxPaper });
    return `第${curPos}开: ${val}条`;
  };
  dist.tooltip.axisPointer = { type: "none" };
  return dist;
};

const RChart = ({ option, maxPaper, onFilter, ...props }) => (
  <Chart
    option={option}
    style={{ width: 10 * 50 + 35, height: maxPaper * 10 + 49 }}
    {...props}
    renderer="canvas"
    onEvents={{
      mousedown: ({ value: [col, row] }) => {
        let curPos = getPosByRowAndCol({ col, row, maxPaper });
        onFilter && onFilter(curPos);
      }
    }}
  />
);

let HeatChart = memo(RChart, (prev, next) =>
  R.equals(prev.option, next.option)
);

export default function HeatmapChart({ cart, onFilter, ...props }) {
  let [option, setOption] = useState({});
  const [data, setData] = useState({});
  useEffect(() => {
    db.getQfmWipJobsPos(cart).then(res => {
      let param = getDrivedState({
        dataSrc: res,
        params: {
          type: "heatmap"
        }
      });
      let dist = beforeRender(param, maxPaper);
      setOption(dist);
    });
  }, []);

  let [maxPaper, setMaxpaper] = useState(getMaxPapersByCarts(cart));
  useEffect(() => {
    setMaxpaper(getMaxPapersByCarts(cart));
  }, [cart[2]]);

  return (
    <HeatChart
      {...props}
      option={option}
      maxPaper={maxPaper}
      onFilter={onFilter}
    />
  );
}
