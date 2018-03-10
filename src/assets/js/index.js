import * as preHandler from "./preHandler";
import render from "./showInDOM";

const cartList = preHandler.init();
console.log(cartList);

render.showCart(cartList);
