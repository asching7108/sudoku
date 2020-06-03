import React, { Component } from 'react';

const SudokuContext = React.createContext({
	hasAuthToken: false,
	user_name: null,
	error: null,
	setError: () => {},
	clearError: () => {},
	setAuthState: () => {},
	setUserName: () => {}
})

export default SudokuContext;

export class SudokuProvider extends Component {
	state = {
		hasAuthToken: false,
		user_name: null,
		error: null
	}

	setError = error => {
		console.error(error);
		this.setState({ error });
	}

	clearError = () => {
		this.setState({ error: null });
	}

	setAuthState = hasAuthToken => {
		this.setState({ hasAuthToken });
	}

	setUserName = user_name => {
		this.setState({ user_name });
	}

	render() {
		const contextValue = {
			hasAuthToken: this.state.hasAuthToken,
			user_name: this.state.user_name,
			error: this.state.error,
			setError: this.setError,
			clearError: this.clearError,
			setAuthState: this.setAuthState,
			setUserName: this.setUserName
		};

		return (
			<SudokuContext.Provider value={contextValue}>
				{this.props.children}
			</SudokuContext.Provider>
		);
	}
}