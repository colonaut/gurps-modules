'use strict';
import React from "react";
import ReactDOM from 'react-dom';
import {ApolloProvider} from "react-apollo";
import {HttpLink} from "apollo-link-http";
import ApolloClient from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";
import {withData} from '../../with';
import GetStats from './queries/get_stats.graphql';

const apollo_link = new HttpLink({ //create a HttpLink, this will prevent CORS prob.
    uri: 'http://localhost:3000/graphql',
    //fetch: fetch //TODO necc for testing (?) put it into test utils?
});
const client = new ApolloClient({
    link: apollo_link,
    cache: new InMemoryCache()
});

const Stat = ({stat}) => {
    console.log('Stat Component base_value', stat.base_value);

    const condition = (x) => {
        console.log(x);
        return true;
    };

    const value = (input) => {
        if (!isNaN(input))
            return Number(input);

        /*
        //remove all whitespaces not in quotes
        const normalize_regex = /\s+(?=([^"]*"[^"]*")*[^"]*$)/;
        input = input.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g, '_');
        console.log('normalized', input);
        console.log(input.split(/_|\*|\+\-/));
         */

        const if_then_else = input.split('@if');
        if (if_then_else.length > 1) { //length > 1 means we have @if, right side must have THEN and ELSE then
            console.log('-> if_then_else length > 1:', if_then_else);
            const mapped = if_then_else
                .filter(x => x.length) //left side could be empty string, so we filter that out before mapping
                .map(part => {
                    if (part.indexOf('THEN') > -1)
                        return new Function(`if(condition('${
                            part.replace('THEN', `')){return value('`)
                                .replace('ELSE', `');} else {return value('`)
                            }');}`);

                    return value(part);
                });

            console.log('-> mapped', mapped);

        }


        return 'TODO';
    };

    return (<div>
        {stat.name} -> {value(stat.base_value)}
    </div>)
};

const Stats = withData(({data, fetchMore}) => <ul>
    {data.stats.map((stat, i) => <Stat key={i} stat={stat}/>)}
</ul>);


class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<ApolloProvider client={client}>
            <Stats query={GetStats} perPage={14}/>
        </ApolloProvider>);
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('App')
);