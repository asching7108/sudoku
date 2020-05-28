import React, { Component } from 'react';

const SudokuContext = React.createContext({
	hasAuthToken: false,
	error: null,
	setError: () => {},
	clearError: () => {},
	setAuthState: () => {}
})

export default SudokuContext;

export class SudokuProvider extends Component {
	state = {
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

	render() {
		const contextValue = {
			hasAuthToken: this.state.hasAuthToken,
			error: this.state.error,
			setError: this.setError,
			clearError: this.clearError,
			setAuthState: this.setAuthState
		};

		return (
			<SudokuContext.Provider value={contextValue}>
				{this.props.children}
			</SudokuContext.Provider>
		);
	}
}