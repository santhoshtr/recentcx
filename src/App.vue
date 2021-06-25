<template>
  <div id="app" class="container">
    <header :class="`connected-${connected}`">Recent translations</header>
    <main class="row justify-center align-start">
      <ul class="translations col-12 ma-0 pa-0" v-if="messages.length">
        <li
          class="row justify-start pa-4"
          :key="message.meta.id"
          v-for="message in messages"
        >
          <h2 class="title ma-0 pa-2 col-12">
            <a :href="message.meta.uri" target="_blank">{{
              message.page_title.replace(/_/g, " ")
            }}</a>
          </h2>
          <div class="col-12">
            <User
              :user="message.performer.user_text"
              :domain="message.meta.domain"
            />
          </div>
        </li>
      </ul>
      <p v-else>Waiting for translations...</p>
    </main>
    <footer>
      <a href="https://github.com/santhoshtr/recentcx">Source code</a>. &copy;
      Santhosh Thottingal
    </footer>
  </div>
</template>

<script>
import User from "./components/User.vue";
import { ref } from "vue";

export default {
  components: { User },
  setup() {
    const EventStreamSource =
      "https://stream.wikimedia.org/v2/stream/page-create";
    const connected = ref(false);
    const eventSource = new EventSource(EventStreamSource);
    const messages = ref([]);

    const isTranslation = (change) =>
      change.parsedcomment.includes(
        "wikipedia.org/wiki/Special:Redirect/revision/"
      );

    eventSource.onopen = () => (connected.value = true);
    eventSource.onerror = () => (connected.value = false);
    eventSource.onmessage = (event) => {
      connected.value = true;
      const change = JSON.parse(event.data);
      if (change.parsedcomment && isTranslation(change)) {
        messages.value.unshift(change);
      }
    };

    return {
      connected,
      messages,
    };
  },
};
</script>

<style lang="less">
@import "./styles/grid.less";

body {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  color: #333333;
  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

main {
  padding: 1rem;
  min-height: 85vh;
}

header {
  padding: 1rem;
  background: whitesmoke;
  font-weight: 700;
  &.connected-true {
    border-bottom: 2px solid #00bfa5;
  }
  &.connected-false {
    border-bottom: 2px solid #d50000;
  }
}

footer {
  padding: 1rem;
  background: whitesmoke;
  min-height: 10vh;
  border-top: 1px solid #00bfa5;
}

.title a {
  text-decoration: none;
  color: #01579b;
}
.date {
  padding: 4px;
}

.title {
  padding: 4px;
  transition: all 0.3s ease-in;
}

ul li {
  &:hover {
    background-color: #fafafa;
  }
}
</style>
