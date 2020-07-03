<template>
  <section class="container">
    <div class="col-12">
      <a
        class="user"
        :href="`https://en.wikipedia.org/wiki/User:${user}`"
        target="_blank"
        >User:{{ user }}</a
      >
      <a
        class="total"
        v-if="total"
        href="#"
        @click="detailsOpen = !detailsOpen"
        title="See contribution graph"
        >{{ total }} translations</a
      >
    </div>
    <chart
      v-if="loaded && detailsOpen"
      :chartdata="chartdata"
      :options="chartOptions"
      :styles="chartStyles"
    />
  </section>
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
    detailsOpen: false,
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
  async mounted() {
    if (this.loaded) return;
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
  cursor: pointer;
}
.user {
  padding-right: 8px;
  border-right: 1px solid #666;
}
</style>
