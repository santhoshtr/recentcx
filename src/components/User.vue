<template>
  <section class="container">
    <div class="col-12">
      <span class="domain pa-2">{{ domain }}</span>
    </div>
    <div class="col-12">
      <a
        class="user pa-2"
        :href="`https://en.wikipedia.org/wiki/User:${user}`"
        target="_blank"
        >User:{{ user }}</a
      >
      <a
        target="_blank"
        class="contributions pa-2"
        :href="`https://xtools.wmflabs.org/pages/${domain}/${user}`"
        >Contributions</a
      >
      <span
        class="total pa-2"
        v-if="total"
        @click="detailsOpen = !detailsOpen"
        title="See contribution graph"
        >{{ total }} translations</span
      >
    </div>
    <Bar
      class="pa-2"
      v-if="loaded && detailsOpen"
      :data="chartdata"
      :options="chartOptions"
      :style="chartStyles"
    />
  </section>
</template>

<script>
import { Bar } from "vue-chart-3";
import { ref, computed, onMounted } from "@vue/runtime-core";
export default {
  name: "UserTranslation",
  props: {
    user: String,
    domain: String,
  },
  components: { Bar },
  setup(props) {
    const detailsOpen = ref(false);
    const loaded = ref(false);
    const chartOptions = { responsive: true, maintainAspectRatio: false };
    const chartStyles = {
      position: "relative",
      height: "300px",
    };

    const publishTrend = ref({});
    const months = computed(() => Object.keys(publishTrend.value));
    const total = computed(() => {
      const lastMonth =
        publishTrend.value[months.value[months.value.length - 1]];
      return lastMonth && lastMonth.count;
    });

    const chartdata = computed(() => {
      return {
        labels: months.value.map((month) =>
          month.split("-").slice(0, 2).join("-")
        ),
        responsive: true,
        datasets: [
          {
            label: "Published translations",
            borderColor: "#40c4ff",
            borderWidth: 2,
            backgroundColor: "#b3e5fc",
            data: months.value.map((month) => publishTrend.value[month].delta),
          },
        ],
      };
    });

    onMounted(() => {
      if (loaded.value) return;

      fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=cxtranslatorstats&translator=${encodeURIComponent(
          props.user
        )}&origin=*&format=json`
      )
        .then((response) => response.json())
        .then((response) => {
          publishTrend.value = response.cxtranslatorstats.publishTrend;
          loaded.value = true;
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
        });
    });

    return {
      loaded,
      total,
      detailsOpen,
      chartStyles,
      chartOptions,
      chartdata,
    };
  },
};
</script>
<style lang="less">
.total {
  color: #009688;
  cursor: pointer;
}
.user {
  color: #009688;
  border-right: 1px solid #999;
}
.contributions {
  color: #009688;
  border-right: 1px solid #999;
}
.domain {
  color: #999;
}
</style>
