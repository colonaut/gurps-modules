import {addMockFunctionsToSchema, makeExecutableSchema, MockList} from 'graphql-tools';
import {ApolloLink, Observable} from 'apollo-link';
import {graphql, print} from 'graphql';
import faker from 'faker';

export const typeDefs = `
    type Query {
      getQuote: Quote
      getQuotes(author: String!): [Quote]
    }
    type Quote {
     data: String!
     author: String!
    }
`;

export const mocks = {
    Int: () => 42,
    Float: () => 98.6,
    String: () => faker.lorem.word(),
    Quote: () => ({
        data: () => faker.lorem.sentence(),
        author: () => faker.name

    })
};

const schema = makeExecutableSchema({typeDefs});
addMockFunctionsToSchema({schema, mocks});
export const link = new ApolloLink(operation => {
    const {query, operationName, variables} = operation;
    return new Observable(observer =>
        graphql(schema, print(query), null, null, variables, operationName)
            .then(result => {
                observer.next(result);
                observer.complete();
            })
            .catch(observer.error.bind(observer))
    );
});