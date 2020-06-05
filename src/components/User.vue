<template>
  <details class="container">
    <summary>
      <span>{{ this.user }}</span>
      <span class="total" v-if="total">({{ total }})</span>
    </summary>
    <div>
      <a :href="`https://en.wikipedia.org/wiki/User:${user}`" target="_blank"
        >User:{{ this.user }}</a
      >
    </div>
    <chart v-if="loaded" :chartdata="chartdata" :options="chartOptions" />
  </details>
</template>

<script>
import Chart from "./Chart.vue";

export default {
  name: "LineChartContainer",
  props: {
    user: String
  },
  components: { Chart },
  data: () => ({
    loaded: false,
    cxtranslatorstats: {},
    chartOptions: {}
  }),
  computed: {
    publishTrend() {
      return this.cxtranslatorstats.publishTrend || {};
    },
    total() {
      const lastMonth = this.publishTrend[this.months[this.months.length - 1]];
      return lastMonth && lastMonth.count;
    },
    months() {
      return Object.keys(this.publishTrend) || [];
    },
    chartdata() {
      return {
        labels: this.months,
        datasets: [
          {
            label: "Published translations",
            borderColor: "#40c4ff",
            borderWidth: 2,
            backgroundColor: "#b3e5fc",
            data: this.months.map(month => this.publishTrend[month].delta)
          }
        ]
      };
    }
  },
  async created() {
    this.loaded = false;
    try {
      const { cxtranslatorstats } = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=cxtranslatorstats&translator=${encodeURIComponent(
          this.user
        )}&origin=*&format=json`
      ).then(response => response.json());
      this.cxtranslatorstats = cxtranslatorstats;
      this.loaded = true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
};
</script>
<style>
.total {
  color: #009688;
  padding: 0 8px;
}
summary:focus {
  outline: none;
}
</style>
