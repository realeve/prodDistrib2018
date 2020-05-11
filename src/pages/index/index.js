import router from "umi/router";

if (!window.location.href.includes("verifyprint")) {
  router.push("/addcart/task");
}
