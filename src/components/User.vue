<template>
  <details class="container">
    <summary>
      <span>{{ user }}</span>
      <span class="total" v-if="total">({{ total }})</span>
    </summary>
    <div>
      <a :href="`https://en.wikipedia.org/wiki/User:${user}`" target="_blank"
        >User:{{ user }}</a
      >
    </div>
    <chart
      v-if="loaded"
      :chartdata="chartdata"
      :options="chartOptions"
      :styles="chartStyles"
    /><span v-else>Loading stats...</span>
  </details>
</template>

<script>
import Chart from "./Chart.vue";

export default {
  name: "UserTranslation",
  props: {
    user: String
  },
  components: { Chart },
  data: () => ({
    loaded: false,
    cxtranslatorstats: {},
    chartOptions: { responsive: true, maintainAspectRatio: false },
    chartStyles: {
      position: "relative",
      height: "300px"
    }
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
        responsive: true,
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

  methods: {
    async fetchStats(user) {
      if (this.loaded) return;
      try {
        const { cxtranslatorstats } = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=cxtranslatorstats&translator=${encodeURIComponent(
            user
          )}&origin=*&format=json`
        ).then(response => response.json());
        this.cxtranslatorstats = cxtranslatorstats;
        this.loaded = true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  },
  mounted: function() {
    this.fetchStats(this.user);
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
