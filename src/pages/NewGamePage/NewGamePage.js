import React, { Component } from 'react';
import PuzzlesApiService from '../../services/puzzles-api-service';
import RecordsApiService from '../../services/records-api-service';
import './NewGamePage.css';

export default class NewGamePage extends Component {
	state = {
		error: null
	};

	onClickLevel(level) {
		PuzzlesApiService.getRandomPuzzleId(level)
			.then(res => RecordsApiService.postRecord(res.puzzle_id))
			.then(res => {
				this.props.history.push(`/game/${res.record.id}`);
			})
			.catch(res => {
				this.setState({ error: res.error });
			})
	}

	render() {
		const { error } = this.state;
		return (
			<section className='NewGamePage'>
				<div role='alert'>
					{error && <p className='red'>{error}</p>}
				</div>
				<button onClick={e => this.onClickLevel(1)}>Very Easy</button>
				<button onClick={e => this.onClickLevel(2)}>Easy</button>
				<button onClick={e => this.onClickLevel(3)}>Normal</button>
				<button onClick={e => this.onClickLevel(4)}>Hard</button>
				<button onClick={e => this.onClickLevel(5)}>Very Hard</button>
			</section>
		);
	}
}