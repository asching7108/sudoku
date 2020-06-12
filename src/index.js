import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import * as serviceWorker from './serviceWorker';
import App from './components/App/App';
import './index.css';

library.add(fab);

ReactDOM.render(
	<BrowserRouter>
			<App />
	</BrowserRouter>, 
	document.getElementById('root')
);

serviceWorker.unregister();