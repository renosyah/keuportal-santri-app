import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";

Vue.config.productionTip = false
Vue.use(VueApollo);

const getHeaders = () => {
    const headers = {};
    if (localStorage.getItem('mbs_session')) {
        const session = JSON.parse(window.localStorage.getItem('mbs_session'));
        headers.session = session.id;
    }
    return headers;
};

const link = new HttpLink({
    uri: process.env.VUE_APP_GRAPHQL_HTTP,
    fetch
});

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext({
        headers: getHeaders()
    })

    return forward(operation)
})

const client = new ApolloClient({
    link: authMiddleware.concat(link),
    cache: new InMemoryCache({
        addTypename: true
    })
});

const apolloProvider = new VueApollo({
    defaultClient: client,
})

new Vue({
    router,
    apolloProvider: apolloProvider,
    render: h => h(App)
}).$mount('#app')