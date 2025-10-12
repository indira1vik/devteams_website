import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { DefaultApolloClient } from "@vue/apollo-composable"
import apolloClient from './lib/apollo'
import router from './router'

const app = createApp(App);
app.provide(DefaultApolloClient, apolloClient);
app.use(router);
app.mount('#app')