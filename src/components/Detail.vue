<template>
  <div id="detail-screen">
      <ul id="question-list">
        <li v-for="item in questions">
          {{item.question}}
          {{item.question}}
          {{item.question}}
          {{item.question}}
          {{item.question}}
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      questions: [],
      limit: 10,
      offset: this.limit,
      filter: '',
      queryString: '',
    };
  },
  mounted() {
    console.log(this.$route);
    if (!$.isEmptyObject(this.$route.query)) {
      for (const prop in this.$route.query) {
        if (this.$route.query.hasOwnProperty(prop)) {
          this.queryString += `${prop}=${this.$route.query[prop]}&`;
          if (prop === 'limit') {
            this.limit = this.$route.query[prop];
          }
          if (prop === 'offset') {
            this.offset = this.$route.query[prop];
          }
          if (prop === 'filter') {
            this.filter = this.$route.query[prop];
            if (this.$route.query[prop] === '') {
              this.$refs.search.focus();
              this.fetchQuestions();
            }
          }
        }
      }
      console.log(this.queryString);
    }
    this.fetchQuestions();
    $('input.input-text').keyup(() => {
      this.filter = $('input.input-text').val();
      this.filterQuestions();
    });
  },
  methods: {
    fetchQuestions: function fetchQuestions() {
      this.$http.get(`https://private-anon-17fff456a3-blissrecruitmentapi.apiary-mock.com/questions?${this.queryString}`)
        .then((response) => {
          const questionList = response.body;
          const tempQuestionList = [{}];
          for (let i = 0; i < this.limit && i < 10; i += 1) {
              if (questionList[i].question.includes(this.filter)) {
                tempQuestionList.push(questionList[i]);
              }
          }
          this.questions = tempQuestionList;
        }).catch((e) => {
          console.log(e);
        });
    },
    filterQuestions: function filterQuestions(queryString) {
      console.log(queryString);
      this.$http.get(`https://private-anon-17fff456a3-blissrecruitmentapi.apiary-mock.com/questions?${this.queryString}`)
        .then((response) => {
          const questionList = response.body;
          const tempQuestionList = [{}];
          for (let i = 0; i < this.limit && i < 10; i += 1) {
            if (this.filter) {
              if (questionList[i].question.includes(this.filter)) {
                tempQuestionList.push(questionList[i]);
              }
            }
          }
          this.questions = tempQuestionList;
        }).catch((e) => {
        console.log(e);
      });
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


</style>
