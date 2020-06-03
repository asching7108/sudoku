import React, { Component } from 'react';
import SudokuContext from '../../contexts/SudokuContext';
import AuthApiService from '../../services/auth-api-service';
import { Button, Input, ButtonsDiv } from '../Utils/Utils';
import './LoginForm.css';

export default class LoginForm extends Component {
	static contextType = SudokuContext;
	
	static defaultProps = {
		onLoginSuccess: () => {},
		onClickOnCancel: () => {}
	};

	state = { error: null };

	handleSubmitJwtAuth = e => {
		e.preventDefault();
		this.setState({ error: null });
		const { email, password } = e.target;

		AuthApiService.postLogin({
			email: email.value,
			password: password.value
		})
			.then(res => {
				email.value = '';
				password.value = '';
				this.context.setAuthState(true);
				this.context.setUserName(res.user_name);
				this.props.onLoginSuccess();
			})
			.catch(res => {
				this.setState({ error: res.error });
			});
	}

	render() {
		const { error } = this.state;
		return (
			<form
				className='LoginForm'
				onSubmit={this.handleSubmitJwtAuth}
			>
				<div role='alert'>
					{error && <p className='red'>{error}</p>}
				</div>
				<div>
					<label htmlFor='LoginForm__email'>
						Email
					</label>
					<Input
						name='email'
						type='email'
						id='LoginForm__email'
						required
					/>
				</div>
				<div>
					<label htmlFor='LoginForm__password'>
						Password
					</label>
					<Input
						name='password'
						type='password'
						id='LoginForm__password'
						required
					/>
				</div>
				<ButtonsDiv>
					<Button type='button' onClick={this.props.onClickOnCancel}>
						Cancel
					</Button>
					<Button type='submit'>
						Sign in
					</Button>
				</ButtonsDiv>
			</form>
		);
	}
}