<template>
  <div id="app" class="container">
    <header :class="`connected-${connected}`">Recent translations</header>
    <main class="row justify-center align-start">
      <ul class="translations col-12 ma-0 pa-0">
        <li
          class="row justify-start pa-4"
          :key="index"
          v-for="(message, index) in messages"
        >
          <h2 class="title ma-0 col-12">
            {{ message.page_title.replace(/_/g, " ")
            }}<a :href="message.meta.uri" target="_blank"
              ><i class="material-icons">launch</i></a
            >
          </h2>
          <span class="domain col-12">{{ message.meta.domain }} </span>
          <span class="user col-12"
            ><User :user="message.performer.user_text" />
          </span>
        </li>
      </ul>
    </main>
    <footer></footer>
  </div>
</template>

<script>
import User from "./components/User";
export default {
  data: () => ({
    eventStreamSource: "https://stream.wikimedia.org/v2/stream/page-create",
    connected: false,
    eventSource: null,
    messages: []
  }),
  components: { User },
  methods: {
    init() {
      this.eventSource = new EventSource(this.eventStreamSource);
    },
    listen() {
      this.eventSource.onopen = () => {
        this.connected = true;
      };
      this.eventSource.onerror = () => {
        this.connected = false;
      };
      this.eventSource.onmessage = event => {
        this.connected = true;
        const change = JSON.parse(event.data);
        if (change.parsedcomment && this.isTranslation(change)) {
          this.messages.unshift(change);
        }
      };
    },
    isTranslation(change) {
      return change.parsedcomment.includes(
        "wikipedia.org/wiki/Special:Redirect/revision/"
      );
    }
  },
  watch: {
    connected: function() {
      if (!this.connected) {
        this.eventSource.close();
        this.init();
        this.listen();
      }
    }
  },
  created: function() {
    this.init();
    this.listen();
  }
};
</script>

<style lang="less">
@import "./styles/grid.less";
@import url("https://rsms.me/inter/inter.css");

body {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  color: #333333;
}

main {
  padding: 1rem;
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
.title {
  text-decoration: none;
  color: #01579b;
}
.date {
  padding: 4px;
}
.domain {
  padding: 0 4px;
  color: #999;
}
.title {
  padding: 4px;
  transition: all 1s ease-in;
}

ul li {
  &:hover {
    background-color: #fafafa;
    border-left: 1px solid #2196f3;
  }
}
</style>
