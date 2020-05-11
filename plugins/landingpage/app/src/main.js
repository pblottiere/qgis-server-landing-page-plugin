import Vue from "vue";
import VueRouter from "vue-router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import App from "./App.vue";

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;
// From the environment
Vue.config.qgisUrl = process.env.VUE_APP_QGIS_SERVER_API_ENDPOINT || "";

// Routing
Vue.use(VueRouter);

import WebGis from "@/views/WebGis.vue";
import Catalog from "@/views/Catalog.vue";

const routes = [
  {
    path: "/",
    name: "catalog",
    component: Catalog,
    meta: {
      title: "QGIS Server Catalog - Home Page",
      metaTags: [
        {
          name: "description",
          content: "List of available project in QGIS Server catalog.",
        },
      ],
    },
  },
  {
    path: "/map/:projectId",
    name: "map",
    component: WebGis,
    props: true,
    meta: {
      title: "QGIS Server Project",
      metaTags: [
        {
          name: "description",
          content: "QGIS Server Project",
        },
      ],
    },
  },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(
    document.querySelectorAll("[data-vue-router-controlled]")
  ).map((el) => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");