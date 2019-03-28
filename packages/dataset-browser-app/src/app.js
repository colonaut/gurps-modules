import React from "react";
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {Query} from "react-apollo";
import propTypes from 'prop-types';
import fetch from 'unfetch';
import gql from "graphql-tag";

import get_advantages from './queries/get_advantage.graphql';
import get_advantage from './queries/get_advantage.graphql';

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


/**
 *
 * @param Component
 * @return {function({page?: *, perPage?: *}): *}
 */
const withData = (Component) => {
    const WrappedComponent = ({query, id, filter, page, perPage}) => {
        const variables = id ? {id: id} : {
            page: page,
            perPage: perPage,
            filter: filter
        };
        if (id)
            console.warn(`withData(${Component.name}) query: id given, page, perPage and filter ignored: ${page}, ${perPage}, ${filter}`);

        return <Query query={query}
                      variables={variables}
        >
            {({loading, error, data, fetchMore}) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;

                return <Component data={data} fetchMore={fetchMore}/>;
            }}
        </Query>
    };

    WrappedComponent.propTypes = {
        query: propTypes.object.isRequired,
        id: propTypes.string,
        filter: propTypes.object,
        perPage: propTypes.number,
        page: propTypes.number
    };

    WrappedComponent.defaultProps = {
        filter: {},
        perPage: 5,
        page: 0
    };

    return WrappedComponent;
};


const Advantage = ({data: {advantageById}, refetch: refetch}) => {
    const handleReload = () => {
        console.log('handleReload');
    };

    return <div>
        <div>
            Hallo?
        </div>
        <button onClick={handleReload}>???</button>
    </div>
};

const AdvantageList = ({data: {allAdvantages}, fetchMore: fetchMore}) => {
    const handleLoadMore = () => {
        fetchMore({
            variables: {
                page: 1,
                perPage: 5
            },
            updateQuery: (previousResult, {fetchMoreResult}) => {
                return Object.assign({}, previousResult, {
                    allAdvantages: [...previousResult.allAdvantages, ...fetchMoreResult.allAdvantages]
                });
            }

        })
    };

    return <div>
        <List>
            {allAdvantages.map((a, i) => <ListItem
                key={`allAdvantages_${i}`}
                primaryText={a.name}
                secondaryText={`Cost: ${a.cost.join('/')} | Source: ${(a.source_books || ['-']).join(',')}`}
            />)}
        </List>
        <button onClick={handleLoadMore}>???</button>
    </div>
};

const AdvantageWithData = withData(Advantage); //4174ce20299f7ac7913d7442549a08d9
const AdvantageListWithData = withData(AdvantageList);


const App = () => <MuiThemeProvider>
    <ApolloProvider client={client}>
        <AdvantageWithData query={get_advantage} id={'4174ce20299f7ac7913d7442549a08d9'}/>
        <AdvantageListWithData query={get_advantages}/>
    </ApolloProvider>
</MuiThemeProvider>;


export default App;