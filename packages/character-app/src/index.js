'use strict';
import React from "react";
import ReactDOM from 'react-dom';

//import axios from 'axios';
//import fetch from 'fetch';
import Github from 'github-api';

const token = 'ee7542898197f3d139aac22811f4c56b63e67d9d';
const base_64 = 'bXkgbmV3IGZpbGUgY29udGVudHM=';

const content = {
    message: 'my commit message',
    content: base_64
};

const gh = new Github({token: token});
//const repo = gh.getRepo('colonaut/gurps.data.json', {token: token});

const repo =

repo.listCommits((a, b) => {
    console.log(a, b);
});

/*repo.getContents('test.json', true, (a, b) => {
    console.log(a, b);
});*/


/*
fetch.fetchUrl('https://api.github.com/repos/colonaut/gurps-data-json/contents/test.json', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'token ee7542898197f3d139aac22811f4c56b63e67d9d'
    },
    payload: content
}, (err, meta, body) => {
   console.log(err, meta, body)
});
*/

/*axios.put('https://api.github.com/repos/colonaut/gurps-data-json/contents/test.json', content).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});

axios.get('https://api.github.com/repos/colonaut/gurps-data-json/contents/test.json'
).then(resp => {
    console.log(resp.data);
}).catch(err => {
    console.log(err);
});*/



class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <p>Hello Character</p>
        </div>);
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('App')
);