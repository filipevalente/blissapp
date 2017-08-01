<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
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
</style>
