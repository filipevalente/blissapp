<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <div class="check-internet">No internet connection!</div>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    setInterval(this.checkForConnection(), 2000);
  },
  methods: {
    checkForConnection: function checkForConnection() {
      if (navigator.onLine === 'false') {
        $('.check-internet').addClass('active');
      } else {
        $('.check-internet').removeClass('active');
      }
    },
  },
};
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
    max-width: 1080px;
    margin: 0 auto;
  }

  .fade-enter-active, .fade-leave-active {
    transition-property: opacity;
    transition-duration: .75s;
  }

  .fade-enter-active {
    transition-delay: .0.25s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }
  .check-internet {
    background-color: #fc4848;
    width: 300px;
    height: 50px;
    position: fixed;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    &.active {
       bottom: 0;
       -webkit-transition: 0.5s;
       -moz-transition: 0.5s;
       -ms-transition: 0.5s;
       -o-transition: 0.5s;
       transition: 0.5s;
     }
  }
</style>
