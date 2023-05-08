import React from 'js/react.development.js';
import ReactDOM from 'js/react-dom.development.js';
function Hello()
{
    return <h1>Hello World!</h1>;
}


const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Hello />);