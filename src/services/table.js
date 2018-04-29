import * as lib from "../utils/lib";
import { uploadHost } from "../utils/axios";
import styles from "../components/Table.less";

const R = require("ramda");

const isFilterColumn = (data, key) => {
  let isValid = true;
  const handleItem = item => {
    if (isValid) {
      item = item.trim();
      let isNum = lib.isNumOrFloat(item);
      let isTime = lib.isDateTime(item);
      if (isNum || isTime) {
        isValid = false;
      }
    }
  };

  let uniqColumn = R.compose(R.uniq, R.map(R.prop(key)))(data);
  R.map(handleItem)(uniqColumn);

  return { uniqColumn, filters: isValid };
};

export function handleColumns(
  { dataSrc, filteredInfo },
  cartLinkMode = "search"
) {
  let { data, header, rows } = dataSrc;
  let showURL = typeof data !== "undefined" && rows > 0;
  if (!rows || rows === 0) {
    return [];
  }

  let column = header.map((title, i) => {
    let key = "col" + i;
    let item = { title };

    item.dataIndex = key;
    // item.key = key;

    let tdValue = data[0][key];
    if (lib.isNumOrFloat(tdValue)) {
      item.sorter = (a, b) => {
        return a[key] - b[key];
      };
    }
    if (!showURL) {
      return item;
    }

    const isCart = lib.isCart(tdValue);
    if (lib.isReel(tdValue) || isCart) {
      item.render = text => {
        let url = lib.searchUrl;
        if (isCart && cartLinkMode !== "search") {
          url = lib.imgUrl;
        }
        const attrs = {
          href: url + text,
          target: "_blank"
        };
        return <a {...attrs}>{text}</a>;
      };
      return item;
    } else if (lib.isInt(tdValue) && !lib.isDateTime(tdValue)) {
      item.render = text => parseInt(text, 10).toLocaleString();
      return item;
    } else {
      item.render = text => {
        text = R.isNil(text) ? "" : text;
        let isImg =
          String(text).includes("/image") || String(text).includes("/file/");
        return !isImg ? (
          text
        ) : (
          <img
            className={styles.imgContent}
            src={`${uploadHost}${text}`}
            alt={text}
          />
        );
      };
    }

    let fInfo = isFilterColumn(data, key);

    if (filteredInfo && fInfo.filters) {
      item.filters = fInfo.uniqColumn.map(text => ({
        text,
        value: text
      }));
      item.onFilter = (value, record) => record[key].includes(value);
      item.filteredValue = filteredInfo[key] || null;
    }
    return item;
  });

  return column;
}

export function handleFilter({ data, filters }) {
  R.compose(
    R.forEach(key => {
      if (filters[key] !== null && filters[key].length !== 0) {
        data = R.filter(item => filters[key].includes(item[key]))(data);
      }
    }),
    R.keys
  )(filters);
  return data;
}

export function updateColumns({ columns, filters }) {
  R.compose(
    R.forEach(key => {
      let idx = R.findIndex(R.propEq("dataIndex", key))(columns);
      columns[idx].filteredValue = filters[key];
    }),
    R.keys
  )(filters);
  return columns;
}

export function handleSort({ dataClone, field, order }) {
  return R.sort((a, b) => {
    if (order === "descend") {
      return b[field] - a[field];
    }
    return a[field] - b[field];
  })(dataClone);
}

export const getPageData = ({ data, page, pageSize }) =>
  data.slice((page - 1) * pageSize, page * pageSize);

export const handleSrcData = data => {
  if (data.length === 0) {
    return data;
  }
  data.data = data.data.map((item, i) => [i + 1, ...item]);
  data.header = ["", ...data.header];
  if (data.rows) {
    data.data = data.data.map((item, key) => {
      let col = { key };
      item.forEach((td, idx) => {
        col["col" + idx] = td;
      });
      return col;
    });
  }
  return data;
};
