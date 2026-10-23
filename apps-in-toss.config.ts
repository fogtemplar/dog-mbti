import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "mydogtype",
  brand: {
    primaryColor: "#E879A4",
  },
  permissions: [],
  webView: {
    bounces: false,
    pullToRefreshEnabled: false,
    overScrollMode: "never",
    allowsBackForwardNavigationGestures: true,
  },
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
  },
  webBundleDir: "out",
});
