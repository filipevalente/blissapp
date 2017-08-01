<template>
  <div id="qls">
    <vue-progress-bar></vue-progress-bar>
    <input type="text" placeholder="Search" class="input-text" ref='search'/>
      <ul id="question-list">
        <li v-for="item in questions">
          <span v-on:click="openItem(item.id)">{{item.question}}</span>
        </li>
      </ul>
    <div class="extras">
      <span class="show-more" v-on:click="showMore(10)">Show more</span><span id="share-button"><span class="underline">Share</span><span v-html="shareButton"></span></span>
      <div class="popup-box">
        <span class="underline btn" v-on:click="shareScreen()" v-bind:data-clipboard-text="shareLink">Copy to Clipboard</span>
        <span class="underline btn" v-on:click="sendToEmail()" v-bind:data-clipboard-text="shareLink">Send to email</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      questions: [],
      limit: 10,
      offsetValue: 0,
      filter: '',
      queryString: '',
      alreadyFetched: 10,
      shareButton: ' <i class="fa fa-share-alt-square" aria-hidden="true"></i>',
      shareLink: '',
      newItems: 0,
    };
  },
  mounted() {
    this.$Progress.start();
    this.alreadyFetched = this.questions.length;
    let showMoreFlag = false;
    let showMoreLimit = 0;
    if (!$.isEmptyObject(this.$route.query)) {
      for (const prop in this.$route.query) {
        if (this.$route.query.hasOwnProperty(prop)) {
          this.queryString += `${prop}=${this.$route.query[prop]}&`;
          if (prop === 'limit') {
            this.limit = this.$route.query[prop];
          }
          if (prop === 'offset') {
            this.offsetValue = this.$route.query[prop];
          }
          if (prop === 'filter') {
            this.filter = this.$route.query[prop];
            if (this.$route.query[prop] === '') {
              this.$refs.search.focus();
            } else {
              $('input.input-text').val(this.$route.query[prop]);
            }
          }
          if (prop === 'more') {
            if (this.$route.query[prop]) {
              showMoreFlag = true;
              showMoreLimit = this.$route.query[prop];
            }
          }
        }
      }
    }
    this.fetchQuestions();
    this.filterQuestions();
    if (showMoreFlag) {
      this.showMore(showMoreLimit);
    }
    $('input.input-text').keyup(() => {
      this.$Progress.finish();
      this.filter = $('input.input-text').val();
      this.filterQuestions();
    });
    this.$Progress.finish();
  },
  methods: {
    fetchQuestions: function fetchQuestions() {
      this.$Progress.start();
      this.$http.get(`https://private-anon-17fff456a3-blissrecruitmentapi.apiary-mock.com/questions?${this.queryString}`)
        .then((response) => {
          const questionList = response.body;
          const tempQuestionList = [{}];
          for (let i = 0; i < this.limit && i < 10; i += 1) {
            if (i >= this.offsetValue) {
              tempQuestionList.push(questionList[i]);
            }
          }
          this.questions = tempQuestionList;
        }).catch((e) => {
          console.log(e);
        });
      this.$Progress.finish();
    },
    filterQuestions: function filterQuestions() {
      this.$Progress.start();
      this.$http.get(`https://private-anon-17fff456a3-blissrecruitmentapi.apiary-mock.com/questions?${this.queryString}`)
        .then((response) => {
          const questionList = response.body;
          const tempQuestionList = [{}];
          for (let i = 0; i < this.limit && i < 10; i += 1) {
            if (i >= this.offsetValue) {
              if (this.filter) {
                if (questionList[i].question.toLowerCase().includes(this.filter.toLowerCase())) {
                  tempQuestionList.push(questionList[i]);
                }
              }
            }
          }
          if (this.filter) {
            this.questions = tempQuestionList;
          }
        }).catch((e) => {
          console.log(e);
        });
      this.$Progress.finish();
    },
    showMore: function showMore(limit) {
      this.$Progress.start();
      const queryString = `https://private-anon-17fff456a3-blissrecruitmentapi.apiary-mock.com/questions?limit=10&offset=${this.alreadyFetched}&filter=${this.filter}`;
      this.$http.get(queryString)
        .then((response) => {
          const questionList = response.body;
          for (let i = 0; (i < 10) && (i < limit); i += 1) {
            this.alreadyFetched = this.questions.length - 1;
            if (i >= this.alreadyFetched) {
              if (i >= this.offsetValue) {
                if (this.filter) {
                  if (questionList[i].question.includes(this.filter)) {
                    this.questions.push(questionList[i]);
                    this.newItems += 1;
                  }
                }
              }
            }
          }
        }).catch((e) => {
          console.log(e);
        });
      this.$Progress.finish();
    },
    shareScreen: function shareScreen() {
      this.shareLink = `${location.protocol}//${location.host}${location.pathname}#/questions?limit=${this.limit}&offset=${this.offsetValue}&filter=${this.filter}&more=${this.newItems}`;
    },
    openItem: function openItem(id) {
      this.$router.push(`/questions?question_id=${id}`);
    },
  },
};
</script>

<style lang="scss">
    #qls {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #2c3e50;
      margin-top: 100px;

    }

    h1, h2 {
      font-weight: normal;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: inline-block;
      margin: 0 10px;
    }

    a {
      color: #42b983;
    }

    .input-text {
      width: 100%;
      border: 0;
      border-bottom: 3px solid #cdcdcd;
      font-size: 20px;
    }

    ul {
      margin-top: 30px;
      &#question-list {
        display: flex;
        flex-direction: column;
        li {
          padding-bottom: 10px;
          margin: 0;
        }
      }
    }
    .extras {
      position: relative;
      span {
        &.show-more {
          padding-right: 15px;
          text-decoration: underline;
        }
        cursor: pointer;
      }
    }
    .underline {
      text-decoration: underline;
    }
    .popup-box {
      position: absolute;
      display: none;
      width: 300px;
      height: 75px;
      background: white;
      -webkit-box-shadow: 1px 1px 2px 1px #cccccc;
      -moz-box-shadow: 1px 1px 2px 1px #cccccc;
      box-shadow: 1px 1px 2px 1px #cccccc;
      top: 100%;
    }



</style>
