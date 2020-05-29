import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { SudokuProvider } from './contexts/SudokuContext';
import App from './components/App/App';
import './index.css';

ReactDOM.render(
	<BrowserRouter>
		<SudokuProvider>
			<App />
		</SudokuProvider>
	</BrowserRouter>, 
	document.getElementById('root')
);

serviceWorker.unregister();