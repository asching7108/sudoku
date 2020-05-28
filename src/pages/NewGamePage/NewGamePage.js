import React, { Component } from 'react';
import './NewGamePage.css';

export default class NewGamePage extends Component {
	onClickLevel(level) {
		this.props.history.push('/game/1');
	}

	render() {
		return (
			<section className='NewGamePage'>
				<button onClick={e => this.onClickLevel(1)}>Very Easy</button>
				<button onClick={e => this.onClickLevel(2)}>Easy</button>
				<button onClick={e => this.onClickLevel(3)}>Normal</button>
				<button onClick={e => this.onClickLevel(4)}>Hard</button>
				<button onClick={e => this.onClickLevel(5)}>Very Hard</button>
			</section>
		);
	}
}