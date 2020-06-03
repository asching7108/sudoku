import React, { Component } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import { LinkButton } from '../../components/Utils/Utils';
import './LoginPage.css';

export default class LoginPage extends Component {
	static defaultProps = { location: {} };

	handleLoginSuccess = () => {
		const { location, history } = this.props;
		const dest = (location.state || {}).from || '/';
		history.push(dest);
	}

	handleClickOnCancel = () => {
		if (this.props.history.action === "PUSH") { this.props.history.goBack(); }
		this.props.history.push('/');
	}
	
	render() {
		return (
			<section className='LoginPage'>
				<h2>Login</h2>
				<LoginForm
					onLoginSuccess={this.handleLoginSuccess}
					onClickOnCancel={this.handleClickOnCancel}
				/>
				<p className='LoginPage__text'>Doesn't have an account?</p>
				<LinkButton to='/signup' className='LoginPage__sign-up'>
					Sign up
				</LinkButton>
			</section>
		);
	}
}