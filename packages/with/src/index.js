'use strict';
import React from 'react';
import {Query} from "react-apollo";
import propTypes from "prop-types";



/**
 *
 * @param Component
 * @return {function({page?: *, perPage?: *}): *}
 */
export function withData(Component) {
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