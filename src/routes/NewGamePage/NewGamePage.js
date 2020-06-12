import React, { Component } from 'react';
import PuzzlesApiService from '../../services/puzzles-api-service';
import RecordsApiService from '../../services/records-api-service';
import './NewGamePage.css';

export default class NewGamePage extends Component {
	onClickLevel(level) {
		PuzzlesApiService.getRandomPuzzleId(level)
			.then(res => RecordsApiService.postRecord(res.puzzle_id))
			.then(res => {
				this.props.history.push(`/game/${res.record.id}`);
			})
			.catch(res => {
				console.log(res.error);
			})
	}

	render() {
		const levels = ['Very Easy', 'Easy', 'Normal', 'Hard', 'Very Hard', 'Crazy'];
		return (
			<section className='NewGamePage'>
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