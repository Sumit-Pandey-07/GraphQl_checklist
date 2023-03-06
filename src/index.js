import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/client';

const client =new ApolloClient({
  uri:'https://react-insta-graph-ql.herokuapp.com/v1/graphql'
})

// client.query({
//   query: gql`
//   query getTodos {
//     react_insta_Schema_todos {
//       done
//       id
//       text
//     }
//   }
//   `
// }).then(data => console.log(data));

ReactDOM.render(
<ApolloProvider client={client}>
<App />
</ApolloProvider>,
document.getElementById('root'));