<template>
  <div id="qls">
    <input type="text" placeholder="Search" class="input-text" :value="filter" ref='search'/>
      <ul id="question-list">
        <li v-for="item in questions">
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
      msg: 'Checking server status',
      loadingIcon: '<i class="fa fa-spinner server-check-loader" aria-hidden="true"></i>',
      status: '',
      questions: [],
      filter: '',
    };
  },
  mounted() {
    this.fetchQuestions();
    let queryString = '';
    console.log(this.$route);
    if (!$.isEmptyObject(this.$route.query)) {
      for (const prop in this.$route.query) {
        if (this.$route.query.hasOwnProperty(prop)) {
          queryString += `${prop}=${this.$route.query[prop]}&`;
          if (prop === 'filter') {
            this.filter = this.$route.query[prop];
            if (this.$route.query[prop] === '') {
              this.$refs.search.focus();
            }
          }
        }
      }
      console.log(queryString);

      this.queryFetchQuestions(queryString);
    }
  },
  methods: {
    fetchQuestions: function fetchQuestions() {
      this.$http.get('https://private-anon-17fff456a3-blissrecruitmentapi.apiary-mock.com/questions?limit=2&offset=1&filter=')
        .then((response) => {
          const questionList = response.body;
          for (let i = 0; i < questionList.length; i += 1) {
            this.questions.push(questionList[i]);
          }
        });
    },
    queryFetchQuestions: function queryFetchQuestions(queryString) {
      console.log(queryString);
      this.$http.get(queryString)
        .then((response) => {
          const questionList = response.body;
          for (let i = 0; i < questionList.length; i += 1) {
            this.questions.push(questionList[i]);
          }
        }).catch((e) => {
          console.log(e);
        });
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


</style>
