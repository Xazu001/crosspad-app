import { onRequest as ___authors___author___kit__js_onRequest } from "C:\\Users\\Xazu\\Desktop\\Xazu\\AStrony\\crosspad-app\\functions\\[authors]\\[author]\\[kit].js"
import { onRequest as ___authors___author__js_onRequest } from "C:\\Users\\Xazu\\Desktop\\Xazu\\AStrony\\crosspad-app\\functions\\[authors]\\[author].js"
import { onRequest as ___image_js_onRequest } from "C:\\Users\\Xazu\\Desktop\\Xazu\\AStrony\\crosspad-app\\functions\\_image.js"
import { onRequest as __authors_js_onRequest } from "C:\\Users\\Xazu\\Desktop\\Xazu\\AStrony\\crosspad-app\\functions\\authors.js"
import { onRequest as __kits_js_onRequest } from "C:\\Users\\Xazu\\Desktop\\Xazu\\AStrony\\crosspad-app\\functions\\kits.js"
import { onRequest as ____path___js_onRequest } from "C:\\Users\\Xazu\\Desktop\\Xazu\\AStrony\\crosspad-app\\functions\\[[path]].js"

export const routes = [
    {
      routePath: "/:authors/:author/:kit",
      mountPath: "/:authors/:author",
      method: "",
      middlewares: [],
      modules: [___authors___author___kit__js_onRequest],
    },
  {
      routePath: "/:authors/:author",
      mountPath: "/:authors",
      method: "",
      middlewares: [],
      modules: [___authors___author__js_onRequest],
    },
  {
      routePath: "/_image",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [___image_js_onRequest],
    },
  {
      routePath: "/authors",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__authors_js_onRequest],
    },
  {
      routePath: "/kits",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__kits_js_onRequest],
    },
  {
      routePath: "/:path*",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [____path___js_onRequest],
    },
  ]