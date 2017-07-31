import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import QLS from '@/components/QLS';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/questions',
      name: 'QLS',
      component: QLS,
    },
  ],
});
