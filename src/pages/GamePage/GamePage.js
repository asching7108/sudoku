import React, { Component } from 'react';
import RecordsApiService from '../../services/records-api-service';
import { ButtonsDiv } from '../../components/Utils/Utils';
import './GamePage.css';

export default class GamePage extends Component {
	constructor(props) {
		super(props);
		const emptySnapshot = Array(81).fill({
			is_default: false,
			def_value: null,
			value: null,
			has_conflict: false,
			memos: Array(9).fill(false)
		});
		this.state = {
			select: null,
			memoMode: false,
			num_empty_cells: 81,
			num_wrong_cells: 0,
			step_id: null,
			max_step_id: null,
			error: null,
			...emptySnapshot
		};
	}

	componentDidMount() {
		RecordsApiService.getRecordById(this.props.match.params.record_id)
			.then(res => {
				this.updateStateRecord(res.record);
				this.setState({ ...res.snapshot });	// faster than calling updateStateCells
			})
			.catch(res => {
				this.setState({ error: res.error });
			});
		document.addEventListener('keydown', this.onPressKeyboardDigit, false);
		document.addEventListener('click', this.onClickElsewhere, true);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.onPressKeyboardDigit, false);
		document.removeEventListener('click', this.onClickElsewhere, true);
	}

	onPressKeyboardDigit = e => {
		// gets keyboard input number 1 to 9
		if (e.keyCode >= 49 && e.keyCode <= 57) {
			this.onClickDigit(e.keyCode - 48);
		}
	}

	onClickElsewhere = e => {
		// removes select on cell
		if (!e.target.closest('.GamePage__board') && !e.target.closest('button')) {
			this.setState({ select: null });
		}
	}

	onClickCell(cell) { this.setState({ select: cell }); }

	onClickMemo() { this.setState(state => ({ memoMode: !state.memoMode })); }

	onClickDigit(value) {
		const { select, step_id, memoMode, ...state } = this.state;

		if (select == null || state[select].is_default) return;

		const cell = state[select];

		// stores current cell values
		const steps = [
			{
				cell_id: select,
				record_id: this.props.match.params.record_id,
				step_type: 'BEFORE',
				value: cell.value,
				has_conflict: cell.has_conflict,
				memos: cell.memos
			}
		];

		const newValue = memoMode || value === cell.value ? null : value;
		const newMemos = cell.memos.map((m, i) => {
			if (!memoMode) return false;
			return (i === value - 1) ? !m : m;
		});

		// stores updated cell values
		steps.push({
			cell_id: select,
			record_id: steps[0].record_id,
			step_type: 'AFTER',
			value: newValue,
			has_conflict: steps[0].has_conflict,	// not updated
			memos: newMemos
		});

		RecordsApiService.postRecordStep(
			this.props.match.params.record_id,
			steps
		)
			.then(res => {
				this.updateStateRecord(res.record);
				this.updateStateCells(res.cells);
			})
			.catch(res => {
				this.setState({ error: res.error });
			});
	}

	onClickUndo() {
		if (!this.state.step_id) return;
		RecordsApiService.updateRecordStep(
			this.props.match.params.record_id,
			'UNDO'
		)
			.then(res => {
				this.updateStateRecord(res.record);
				this.updateStateCells(res.cells);
			})
			.catch(res => {
				this.setState({ error: res.error });
			});
	}

	onClickRedo() {
		if (this.state.step_id ===this.state.max_step_id) return;
		RecordsApiService.updateRecordStep(
			this.props.match.params.record_id,
			'REDO'
		)
			.then(res => {
				this.updateStateRecord(res.record);
				this.updateStateCells(res.cells);
			})
			.catch(res => {
				this.setState({ error: res.error });
			});
	}

	updateStateRecord(record) {
		this.setState({
			num_empty_cells: record.num_empty_cells,
			num_wrong_cells: record.num_wrong_cells,
			step_id: record.step_id,
			max_step_id: record.max_step_id
		});
	}

	updateStateCells(cells) {
		cells.forEach(c => {
			if (c.memos) {
				this.setState({ [c.cell_id]: c });
			}
			else {
				this.setState(state => ({
					[c.cell_id]: {
						cell_id: c.cell_id,
						is_default: c.is_default,
						def_value: c.def_value,
						value: c.value,
						has_conflict: c.has_conflict,
						memos: state[c.cell_id].memos
					}
				}));
			}
		})
	}

	renderBoard() {
		return (
			<div className='GamePage__board col'>
				{[...Array(9)].map((_, i) => this.renderBoardRow(i))}
			</div>
		);
	}

	renderBoardRow(row) {
		return (
			<div className='GamePage__board-row row' key={`row-${row}`}>
				{[...Array(9)].map((_, i) => this.renderBoardCell(row, i))}
			</div>
		);
	}

	renderBoardCell(row, col) {
		const { select, ...state } = this.state;
		const cell = row * 9 + col;

		let cellValueClass = 'GamePage__cell-value row';
		if (state[cell].is_default) cellValueClass += ' default';
		if (state[cell].has_conflict) cellValueClass += ' conflict';
		if (select === cell) cellValueClass += ' select';
		
		return (
			<div className='GamePage__board-cell' key={`cell-${cell}`}>
				{[...Array(3)].map((_, i) => 
					<div className='GamePage__memo-row row' key={`memo-row-${i}`}>
						{[...Array(3)].map((_, j) => this.renderCellMemo(cell, i * 3 + j))}
					</div>
				)}
				<div 
					className={cellValueClass}
					tabIndex={0}
					onFocus={e => this.onClickCell(cell)}
					onClick={e => this.onClickCell(cell)}
				>
					{state[cell].value}
				</div>
			</div>
		);
	}

	renderCellMemo(cell, memo) {
		const { ...state } = this.state;
		return (
			<div className='GamePage__memo row' key={`${cell}-${memo}`}>
				{!state[cell].memos[memo] ? '' : memo + 1}
			</div>
		);
	}

	renderDigits() {
		return (
			<div className='GamePage__digits'>
				{[...Array(9)].map((_, i) => (
					<button key={i} onClick={e => this.onClickDigit(i + 1)}>{i + 1}</button>
				))}
			</div>
		);
	}

	render() {
		const { memoMode, num_empty_cells, num_wrong_cells } = this.state;

		let memoClass = 'GamePage__memo-btn';
		if (memoMode) memoClass += ' mode-on';

		return (
			<section className='GamePage'>
				{this.renderBoard()}
				<ButtonsDiv className='GamePage__edit-div'>
					<button className='GamePage__step-control' onClick={e => this.onClickUndo()}>
						undo
					</button>
					<button className='GamePage__step-control' onClick={e => this.onClickRedo()}>
						redo
					</button>
				</ButtonsDiv>
				<button className={memoClass} onClick={e => this.onClickMemo()}>
					memo
				</button>
				{this.renderDigits()}
				{memoMode && (
					<div className='GamePage__note'>Memo mode: add memos of numbers</div>
				)}
				{!num_empty_cells && !num_wrong_cells && (
					<div>You win!</div>
				)}
			</section>
		);
	}
}