import React, { Component } from 'react';
import RecordsApiService from '../../services/records-api-service';
import './GamePage.css';

export default class GamePage extends Component {
	constructor(props) {
		super(props);
		const emptySnapshot = Array(81).fill({
			is_default: false,
			def_value: '',
			value: '',
			memos: Array(9).fill(false)
		});
		this.state = {
			select: null,
			memoMode: false,
			num_empty_cells: 81,
			num_wrong_cells: 0,
			error: null,
			...emptySnapshot
		};
	}

	componentDidMount() {
		RecordsApiService.getRecordById(this.props.match.params.record_id)
			.then(res => {
				this.setState({
					num_empty_cells: res.record.num_empty_cells,
					num_wrong_cells: res.record.num_wrong_cells,
					...res.snapshot
				});
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
		if (e.keyCode >= 49 && e.keyCode <= 57) {
			this.onClickDigit(e.keyCode - 48);
		}
	}

	onClickElsewhere = e => {
		if (!e.target.closest('.GamePage__board') && !e.target.closest('button')) {
			this.setState({ select: null });
		}
	}

	onClickCell(cell) { this.setState({ select: cell }); }

	onClickMemo() { this.setState(state => ({ memoMode: !state.memoMode })); }

	onClickDigit(value) {
		
		const { select, memoMode } = this.state;

		if (select == null || this.state[select].is_default) return;

		const cell = this.state[select];
		const newValue = memoMode || value === cell.value ? '' : value;
		const newMemos = cell.memos.map((m, i) => {
			if (!memoMode) return '';
			return (i === value - 1) ? !m : m;
		});
		this.updatenum_empty_cells(select, newValue);
		this.updatenum_wrong_cells(select, newValue);
		const has_conflict = this.validate(select, newValue, null);

		this.setState({
			[select]: {
				is_default: cell.is_default,
				def_value: cell.def_value,
				value: newValue,
				memos: newMemos,
				has_conflict
			}
		})
	}

	updatenum_empty_cells(cellNo, newValue) {
		const cell = this.state[cellNo];
		let numChange = 0;
		if (!cell.value && newValue) numChange--;
		else if (cell.value && !newValue) numChange++;
		this.setState({
			num_empty_cells: this.state.num_empty_cells + numChange
		});
	}

	updatenum_wrong_cells(cellNo, newValue) {
		const cell = this.state[cellNo];
		let numChange = 0;
		if (cell.value && cell.value !== cell.def_value && 
			(!newValue || newValue === cell.def_value)) {
				numChange--;
		}
		else if (newValue && newValue !== cell.def_value && 
			(!cell.value || cell.value === cell.def_value)) {
				numChange++;
		}
		this.setState({
			num_wrong_cells: this.state.num_wrong_cells + numChange
		});
	}

	validate(cellNo, newValue, excludeNo) {
		const { ...state } = this.state;
		const row = Math.floor(cellNo / 9);
		const col = cellNo % 9;
		const cellsToValidate = [];
		let has_conflict = false;

		[...Array(9)].map((_, i) => {
			cellsToValidate.push(row * 9 + i);
			cellsToValidate.push(i * 9 + col);
			const r = Math.floor(row / 3) * 3 + Math.floor(i / 3);
			const c = Math.floor(col / 3) * 3 + i % 3;
			cellsToValidate.push(r * 9 + c);
		})

		cellsToValidate.forEach(no => {
			if (no !== cellNo && no !== excludeNo) {
				if (newValue && newValue === state[no].value) {
					state[no].has_conflict = !state[no].is_default;
					has_conflict = true;
				}
				else if (state[no].has_conflict) {
					const conflict = this.validate(no, state[no].value, cellNo);
					state[no].has_conflict = conflict;
				}
			}
		})

		return has_conflict;
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
				<button className={memoClass} onClick={e => this.onClickMemo()}>
					memo
				</button>
				{this.renderDigits()}
				{!num_empty_cells && !num_wrong_cells && (
					<div>You win!</div>
				)}
			</section>
		);
	}
}