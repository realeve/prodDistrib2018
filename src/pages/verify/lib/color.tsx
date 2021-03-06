const COLOR_PLATE_8 = [
  "#1890FF",
  "#2FC25B",
  "#FACC14",
  "#223273",
  "#8543E0",
  "#13C2C2",
  "#3436C7",
  "#F04864"
];
const COLOR_PLATE_16 = [
  "#1890FF",
  "#41D9C7",
  "#2FC25B",
  "#FACC14",
  "#E6965C",
  "#223273",
  "#7564CC",
  "#8543E0",
  "#5C8EE6",
  "#13C2C2",
  "#5CA3E6",
  "#3436C7",
  "#B381E6",
  "#F04864",
  "#D598D9"
];
const COLOR_PLATE_24 = [
  "#1890FF",
  "#66B5FF",
  "#41D9C7",
  "#2FC25B",
  "#6EDB8F",
  "#9AE65C",
  "#FACC14",
  "#E6965C",
  "#57AD71",
  "#223273",
  "#738AE6",
  "#7564CC",
  "#8543E0",
  "#A877ED",
  "#5C8EE6",
  "#13C2C2",
  "#70E0E0",
  "#5CA3E6",
  "#3436C7",
  "#8082FF",
  "#DD81E6",
  "#F04864",
  "#FA7D92",
  "#D598D9"
];
const COLOR_PIE = [
  "#1890FF",
  "#13C2C2",
  "#2FC25B",
  "#FACC14",
  "#F04864",
  "#8543E0",
  "#3436C7",
  "#223273"
];
const COLOR_PIE_16 = [
  "#1890FF",
  "#73C9E6",
  "#13C2C2",
  "#6CD9B3",
  "#2FC25B",
  "#9DD96C",
  "#FACC14",
  "#E6965C",
  "#F04864",
  "#D66BCA",
  "#8543E0",
  "#8E77ED",
  "#3436C7",
  "#737EE6",
  "#223273",
  "#7EA2E6"
];

const FLAT_UI_COLOR = [
  "#16A085",
  "#27AE60",
  "#2980B9",
  "#8E44AD",
  "#2C3E50",
  "#F39C12",
  "#D35400",
  "#C0392B",
  "#BDC3C7",
  "#7F8C8D",
  "#1ABC9C",
  "#2ECC71",
  "#3498DB",
  "#9B59B6",
  "#34495E",
  "#F1C40F",
  "#E67E22",
  "#E74C3C",
  "#95A5A6"
];

const DEFAULT_COLOR = "#1890FF";

const ANTV = [
  "#61A5E8",
  "#7ECF51",
  "#EECB5F",
  "#E4925D",
  "#E16757",
  "#9570E5",
  "#605FF0",
  "#85ca36",
  "#1c9925",
  "#0d8b5f",
  "#0f9cd3",
  "#2f7e9b",
  "#2f677d",
  "#9b7fed",
  "#7453d6",
  "#3b1d98",
  "#27abb1",
  "#017377",
  "#015f63",
  "#b86868",
  "#5669b7",
  "#e5aab4",
  "#60b65f",
  "#98d2b2",
  "#c9c8bc",
  "#45c3dc",
  "#e17979",
  "#5baa5a",
  "#eaccc2",
  "#ffaa74"
];

const getColor: (len: number, type: string) => Array<string> = (len, type) => {
  if (type === "pie") {
    return len > 8 ? COLOR_PIE_16 : COLOR_PIE;
  }
  return len <= 8 ? COLOR_PLATE_8 : len <= 16 ? COLOR_PLATE_16 : COLOR_PLATE_24;
};

export default {
  COLOR_PLATE_8,
  COLOR_PLATE_16,
  COLOR_PLATE_24,
  COLOR_PIE,
  COLOR_PIE_16,
  DEFAULT_COLOR,
  ANTV,
  FLAT_UI_COLOR,
  getColor
};
