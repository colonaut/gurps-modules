import React from "react";
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {Query} from "react-apollo";
import fetch from 'unfetch';
import gql from "graphql-tag";
import graphql from 'graphql-tag';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';


const apollo_link = new HttpLink({ //create a HttpLink, this will prevent CORS prob.
    uri: 'http://localhost:3000/graphql',
    //fetch: fetch //TODO necc for testing (?) put it into test utils?
});
const client = new ApolloClient({
    link: apollo_link,
    cache: new InMemoryCache()
});

const allAdvantages = gql`
    {
        allAdvantages(page: 0, perPage: 10) {
            name
            cost
            source_books
        }
    }
`;

const withAdvantagesQuery = (Component) =>
class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Query query={allAdvantages}>
            {({loading, error, data, fetchMore}) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;

                console.log(fetchMore)
                return <Component data={data} fetchMore={fetchMore}/>;
            }}
        </Query>
    };
};


const AdvantageList = ({data: {allAdvantages}}) => <List>
    {allAdvantages.map((a, i) => <ListItem
        key={`allAdvantages_${i}`}
        primaryText={a.name}
        secondaryText={`Cost: ${a.cost.join('/')} | Source: ${(a.source_books || ['-']).join(',')}`}
    />)}
</List>;


const Foo = withAdvantagesQuery(AdvantageList);

const App = () => <MuiThemeProvider>
        <ApolloProvider client={client}>
            <Foo/>
        </ApolloProvider>
</MuiThemeProvider>;


const App_ = () => <MuiThemeProvider>
    <ApolloProvider client={client}>
        <Query query={allAdvantages}>
            {({loading, error, data}) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;

                const advantages = data.allAdvantages;

                return (
                    <List>
                        {advantages.map((a, i) => <ListItem
                            key={`allAdvantages_${i}`}
                            primaryText={a.name}
                            secondaryText={`Cost: ${a.cost.join('/')} | Source: ${(a.source_books || ['-']).join(',')}`}
                        />)}
                    </List>
                );
            }}
        </Query>
    </ApolloProvider>
</MuiThemeProvider>;

export default App;