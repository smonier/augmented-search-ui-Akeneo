import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache
} from '@apollo/client';
import {BrowserRouter as Router} from 'react-router-dom';

const httpLink = createHttpLink({
    uri: '/modules/graphql'
});

// 3
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});
const bootstrap = function (target, context) {
    ReactDOM.render(
        <ApolloProvider client={client}>
            <Router>
                <App dxContext={context}/>
            </Router>,
        </ApolloProvider>, document.getElementById(target));
};

window.augmentedSearchUIApp = bootstrap;
