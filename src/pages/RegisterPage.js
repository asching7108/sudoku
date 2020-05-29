import React, { Component } from 'react';
import SudokuContext from '../contexts/SudokuContext';
import RegisterForm from '../components/RegisterForm/RegisterForm';

export default class RegisterPage extends Component {
	static contextType = SudokuContext;

	handleRegisterSuccess = () => {
		const { history } = this.props;
		this.context.setAuthState(true);
		history.push('/');
	}

	handleClickOnCancel = () => {
		this.props.history.push('/');
	}

	render() {
		return (
			<section className='RegisterPage'>
				<h2>Create an acount</h2>
				<RegisterForm
					onRegisterSuccess={this.handleRegisterSuccess}
					onClickOnCancel={this.handleClickOnCancel}
				/>
			</section>
		);
	}
}