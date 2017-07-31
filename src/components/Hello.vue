<template>
  <div id="index">
    <span v-html="loadingIcon"></span>
    <h1>{{ msg }} </h1>
    <a href="#" class="button" v-show="status!='OK' && status!=''" v-on:click="recheckServerStatus()">Try again </a>
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
      };
    },
    created: function created() {
      this.$emit('page-loaded');
    },
    methods: {
      checkServerStatus: function checkServerStatus() {
        this.msg = 'Checking server status';
        $('.server-check-loader').addClass('fa-spin');
        this.$http.get('https://private-anon-17fff456a3-blissrecruitmentapi.apiary-mock.com/health')
          .then((response) => {
            this.status = response.body.status;
            if (this.status === 'OK') {
//          status = this.status;
              $('.server-check-loader').toggleClass('fa-spinner fa-check-circle');
              $('.server-check-loader').removeClass('fa-spin');
              this.$router.push('/questions');
            } else {
              this.msg = 'Service Unavailable. Please try again later.';
              this.status = 'Unavailable';
              $('.server-check-loader').css('display', 'none');
            }
          });
      },
      recheckServerStatus: function recheckServerStatus() {
        this.msg = 'Checking server status';
        $('.server-check-loader').addClass('fa-spin');
        $('.server-check-loader').toggleClass('fa-check-circle fa-spinner');
        this.$http.get('https://private-anon-17fff456a3-blissrecruitmentapi.apiary-mock.com/health')
          .then((response) => {
            this.status = response.body.status;
            if (this.status === 'OK') {
              $('.server-check-loader').removeClass('fa-spinner');
              $('.server-check-loader').addClass(' fa-check-circle');
              $('.server-check-loader').removeClass('fa-spin');
              $('.server-check-loader').css('display', 'block');
              this.$router.push('/questions');
            } else {
              this.msg = 'Service Unavailable. Please try again later.';
              this.status = 'Unavailable';
              $('.server-check-loader').css('display', 'none');
            }
          });
      },
    },
    mounted() {
      this.checkServerStatus();
    },
  };
</script>

<style lang="scss" scoped>
  #index {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
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

  .server-check-loader {
    font-size: 30px;
    &.fa-check-circle {
      color: green;
    }
  }

</style>
