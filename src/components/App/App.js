import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from '../Header/Header';
import HomePage from '../../pages/HomePage/HomePage';
import LoginPage from '../../pages/LoginPage/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import NewGamePage from '../../pages/NewGamePage/NewGamePage';
import ArchivesPage from '../../pages/ArchivesPage/ArchivesPage';
import GamePage from '../../pages/GamePage/GamePage';
import NotFoundPage from '../../pages/NotFoundPage';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		console.error(error);
		return { hasError: true };
	};

	render() {
		const { hasError } = this.state;
		return (
			<div className='App'>
				<header className='App__header'>
					<Header />
				</header>
				<main className='App__main'>
					{
						hasError && 
						<p className='red'>Something went wrong. Please refresh the page or try again later.</p>
					}
					<Switch>
						<Route
							exact
							path='/'
							component={HomePage}
						/>
						<Route
							path='/signin'
							component={LoginPage}
						/>
						<Route
							path='/signup'
							component={RegisterPage}
						/>
						<Route
							path='/new'
							component={NewGamePage}
						/>
						<Route
							path='/archives'
							component={ArchivesPage}
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
			</div>
		);
	}
}

export default App;
