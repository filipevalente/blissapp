<template>
  <div id="qls">
    <vue-progress-bar></vue-progress-bar>
    <div v-esc="escape"></div>
    <input type="text" placeholder="Search" class="input-text" ref='search'/>
      <ul id="question-list">
        <li v-for="item in questions">
          <span v-on:click="openItem(item.id)">{{item.question}}</span>
        </li>
      </ul>
    <div class="extras">
      <span class="show-more" v-on:click="showMore(10)">Show more</span><span id="share-button"><span class="underline" v-on:click="shareScreen()">Share</span><span v-html="shareButton" v-on:click="shareScreen()"></span></span>
      <div class="overlay" v-on:click="hideOverlay()"></div>
      <div class="popup-box">
        <span class="underline btn" v-on:click="shareScreen()" v-bind:data-clipboard-text="shareLink">Copy to Clipboard</span>
        <span class="underline btn" v-on:click="sendToEmail()" v-bind:data-clipboard-text="shareLink">Send to email</span>
        <div class="input-email-wrapper">
          <input v-validate="'required|email'" type="text" name="email" placeholder="Enter destination email" class="email-input"/> <i class="fa fa-paper-plane send-email-button" v-on:click="sendLinkToEmail()" aria-hidden="true"></i>
        </div>
        <span v-show="errors.has('email')" class="error-message">{{ errors.first('email') }}</span>
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
      this.$Progress.start();
      this.filter = $('input.input-text').val();
      this.filterQuestions();
      this.$Progress.finish();
    });
    this.$Progress.finish();
  },
  methods: {
    fetchQuestions: function fetchQuestions() {
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
      $('.overlay').addClass('active');
      $('.popup-box').addClass('active');
    },
    openItem: function openItem(id) {
      this.$router.push(`/questions?question_id=${id}`);
    },
    sendToEmail: function sentToEmail() {
      $('.popup-box').toggleClass('send-to-email');
    },
    sendLinkToEmail: function sendLinkToEmail() {
      if (!this.errors.has('email') && !($('.email-input').val().length === 0)) {
        const email = $('.email-input').val();
        const shareLink = this.shareLink;
        this.$http.post(`https://private-anon-17fff456a3-blissrecruitmentapi.apiary-mock.com/share?destination_email=${email}&content_url=${shareLink}`);
      }
    },
    hideOverlay: function hideOverlay() {
      $('.overlay').removeClass('active');
      $('.popup-box').removeClass('active');
    },
    escape() {
      if ($('.overlay').hasClass('active')) {
        $('.overlay').removeClass('active');
        $('.popup-box').removeClass('active');
      }
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

    .overlay {
      position: fixed;
      display: none;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(51, 51, 51, 0.5);
      z-index: 2;
      &.active {
        display: block;
      }
    }
    .popup-box {
      position: fixed;
      display: flex;
      visibility: hidden;
      z-index: 3;
      width: 300px;
      height: 75px;
      background: white;
      -webkit-box-shadow: 0px 0px 12px 0px #747474;
      box-shadow: 0px 0px 12px 0px #747474;
      top: 50%;
      flex-direction: column;
      padding-top: 15px;
      align-items: center;
      left: 50%;
      transform: translate(-50%,-50%);
      -webkit-transition: height 0.75s;
      -moz-transition: height 0.75s;
      -ms-transition: height 0.75s;
      -o-transition: height 0.75s;
      transition: height 0.75s;
      &.active {
        visibility: visible;
      }
      &.send-to-email {
        height: 125px;
        -webkit-transition: height 0.75s;
        -moz-transition: height 0.75s;
        -ms-transition: height 0.75s;
        -o-transition: height 0.75s;
        transition: height 0.75s;
        .input-email-wrapper {
          display: initial;
        }

      }
    }
    .input-email-wrapper {
      padding: 5px 0;
      width: 100%;
      display: none;
      color: #333;
      .email-input {
        margin-top: 25px;
        width: 75%;
        align-self: left;
        margin-left: 15px;
        border: 0;
        border-bottom: 3px solid gray;
      }
    }
    .error-message {
      color: #ff3860;
      font-size: 12px;
    }
    .send-email-button {
      cursor: pointer;
    }

</style>
