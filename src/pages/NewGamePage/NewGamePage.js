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
		const levels = ['Very Easy', 'Easy', 'Normal', 'Hard', 'Very Hard', 'Crazy'];
		return (
			<section className='NewGamePage'>
				<div role='alert'>
					{error && <p className='red'>{error}</p>}
				</div>
				{levels.map((lv, i) => (
					<button 
						key={i}
						className='NewGamePage__btn' 
						onClick={e => this.onClickLevel(i + 1)}
					>
						{lv}
					</button>
				))}
			</section>
		);
	}
}