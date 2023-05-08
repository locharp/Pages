//import React from 'js/react.development.js';
//import ReactDOM from 'js/react-dom.development.js';

function Hello()
{
    return <h1>Hello world</h1>;
}


const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<Hello />);