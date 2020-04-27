<template>
  <div id="app" class="container">
    <header :class="`connected-${connected}`">Recent translations</header>
    <main class="row justify-center align-start">
      <ul class="translations col col-lg-10 col-md-12 ma-0 pa-0">
        <li
          class="row justify-start pa-4"
          :key="index"
          v-for="(message, index) in messages"
        >
          <span class="domain col-3">{{ message.meta.domain }}</span>
          <a class="title col-5" :href="message.meta.uri">{{
            message.page_title
          }}</a>
          <span class="user col-3">{{ message.performer.user_text }}</span>
        </li>
      </ul>
    </main>
    <footer></footer>
  </div>
</template>

<script>
export default {
  data: () => ({
    eventStreamSource: "https://stream.wikimedia.org/v2/stream/page-create",
    connected: false,
    eventSource: null,
    messages: []
  }),
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
  color: royalblue;
}
.date {
  padding: 4px;
}
.domain {
  padding: 4px;
}
.title {
  padding: 4px;
  transition: all 1s ease-in;
}

ul li {
  &:hover {
    background-color: #e3f2fd;
    border-left: 1px solid #2196f3;
  }
}
</style>
