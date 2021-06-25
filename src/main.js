import { createApp } from "vue";
import App from "./App.vue";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

createApp(App).mount("#app");
