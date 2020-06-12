import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PuzzlesApiService from '../../services/puzzles-api-service';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import HomePage from '../../routes/HomePage/HomePage';
import NewGamePage from '../../routes/NewGamePage/NewGamePage';
import GamePage from '../../routes/GamePage/GamePage';
import NotFoundPage from '../../routes/NotFoundPage';
import './App.css';

class App extends Component {
	componentDidMount() {
		PuzzlesApiService.pingServer()
			.then(() => {
				console.log('Server is alive!');
			})
			.catch(() => {
				console.log('Unable to reach the server.');
			});
	}

	render() {
		return (
			<div className='App'>
				<header className='App__header'>
					<Header />
				</header>
				<main className='App__main'>
					<Switch>
						<Route
							exact
							path='/'
							component={HomePage}
						/>
						<Route
							path='/new'
							component={NewGamePage}
						/>
						<Route
							path='/game/:record_id'
							component={GamePage}
						/>
						<Route
							component={NotFoundPage}
						/>
					</Switch>
				</main>
				<Footer />
			</div>
		);
	}
}

export default App;
