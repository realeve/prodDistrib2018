
let cartTbl = cartList => {
  let { carts } = cartList;
  let header = [{ "title": "车号" }, { "title": "冠号" }, { "title": "字号" }, { "title": "工序" }, { "title": "班次" }, { "title": "机台" }, { "title": "机长" }, { "title": "生产日期" }, { "title": "开始时间" }, { "title": "星期" }, { "title": "DAYIDX" }, { "title": "品种" }];
  let headerHTML = header.map(item => `<th>${item.title}</th>`);
  let tbodyHTML = carts.map(tr => {
    let str = tr.map(td => `<td>${td}</td>`).join('');
    return `<tr>${str}</tr>`;
  })
  return `<table class="table table-bordered table-hover table-responsive">
      <thead><tr>${headerHTML}</tr></thead>
      <tbody>${tbodyHTML}</tbody>
    </table>
  `.replace(/,/g, '')
}

let showCart = cartList => {
  let html = cartTbl(cartList);
  $('#table').html(html)
}


export default {
  showCart
}