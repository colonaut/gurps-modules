import React from "react";
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {Query} from "react-apollo";
import fetch from 'unfetch';
import gql from "graphql-tag";

const apollo_link = process.env.NODE_ENV === 'development' ?
    require('../../mocks/schema.js').link : new HttpLink({ //create a HttpLink, this will prevent CORS prob.
        uri: 'github???', //TODO
        fetch: fetch //TODO necc for testing (?) put it into test utils?
    });

const client = new ApolloClient({
    link: apollo_link,
    cache: new InMemoryCache()
});

const GET_QUOTES = gql`
    {
        getQuotes(author: "foo") {
            data
            author
        }
    }
`;
const GET_QUOTE = gql`
    {
        getQuote {
            data
            author
        }
    }
`;

const App = () => <ApolloProvider client={client}>
    <Query query={GET_QUOTE}>
        {({loading, error, data}) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            //const random_index =  Math.floor(Math.random() * data.getQuotes.length);
            //const quote = data.getQuotes[random_index];
            const quote = data.getQuote;

            return (
                <div>
                    {quote.author} says: "{quote.data}"
                </div>
            );
        }}
    </Query>
</ApolloProvider>;

export default App;