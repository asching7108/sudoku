import React, { Component } from 'react';
import moment from 'moment';
import RecordsApiService from '../../services/records-api-service';
import Modal from '../../components/Modal/Modal';
import './GamePage.css';

export default class GamePage extends Component {
	static defaultProps = {
		match: { params: '' }
	}

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
			duration: moment.duration(0),
			select: null,
			memoMode: false,
			num_empty_cells: 81,
			num_wrong_cells: 0,
			step_id: null,
			max_step_id: null,
			is_solved: false,
			showModal: false,
			...emptySnapshot
		};
	}

	componentDidMount() {
		RecordsApiService.getRecordById(this.props.match.params.record_id)
			.then(res => {
				this.updateStateRecord(res.record);
				this.setState({ 
					duration: moment.duration(res.record.duration, 'seconds'),
					...res.snapshot	// faster than calling updateStateCells
				});
				this.updateGameStatus(false);
			})
			.catch(res => {
				console.error(res.error);
			});

		document.addEventListener('keydown', this.onPressKeyboardDigit, false);
		document.addEventListener('click', this.onClickElsewhere, true);
		window.addEventListener('beforeunload', this.updateRecordDuration);
		this.addDuration = window.setInterval(() => {
			this.setState({ duration: this.state.duration.add(1000)});
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.updateDuration);
		clearInterval(this.addDuration);
		document.removeEventListener('keydown', this.onPressKeyboardDigit, false);
		document.removeEventListener('click', this.onClickElsewhere, true);
		this.updateRecordDuration();
	}

	onPressKeyboardDigit = e => {
		const k = e.keyCode;
		// input number 1 to 9
		if (k >= 49 && k <= 57) {
			this.onClickDigit(k - 48);
		}
		// input arrow movement
		else if (k >= 37 && k <= 40) {
			const { select } = this.state;
			let r = Math.floor(select / 9);
			let c = select % 9;
			if (k % 2 === 0) { r = Math.min(8, Math.max(0, r + (k - 39))); }
			else { c = Math.min(8, Math.max(0, c + (k - 38))); }
			this.setState({ select: r * 9 + c });
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
		const { duration, is_solved, select, step_id, memoMode, ...state } = this.state;

		if (is_solved || select === null || state[select].is_default) return;

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
			duration.as('seconds'),
			steps
		)
			.then(res => {
				this.updateStateRecord(res.record);
				this.updateStateCells(res.cells);
				this.updateGameStatus(true);
			})
			.catch(res => {
				console.error(res.error);
			});
	}

	onClickUndoOrRedo(edit_type) {
		const { duration, step_id, max_step_id } = this.state;
		if ((edit_type === 'UNDO' && !step_id) ||
				(edit_type === 'REDO' && step_id === max_step_id)) {
			return;
		}

		RecordsApiService.updateRecordStep(
			this.props.match.params.record_id,
			edit_type,
			duration.as('seconds'),
		)
			.then(res => {
				this.updateStateRecord(res.record);
				this.updateStateCells(res.cells);
				this.updateGameStatus(true);
			})
			.catch(res => {
				console.error(res.error);
			});
	}

	onCloseModal = () => { this.setState({ showModal: false }); }

	onClickNewGame = () => { this.props.history.push('/new'); }

	updateRecordDuration = () => {
		RecordsApiService.updateRecord(
			this.props.match.params.record_id,
			{ duration: this.state.duration.as('seconds') }
		)
			.catch(res => {
				console.error(res.error);
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

	updateGameStatus(shouldShowModal) {
		const { num_empty_cells, num_wrong_cells } = this.state;
		if (!num_empty_cells && !num_wrong_cells) {
			this.setState({
				is_solved: true,
				showModal: shouldShowModal,
				select: null
			});
			clearInterval(this.addDuration);
		}
	}

	isRelativeCell(cell, select) {
		if (Math.floor(cell / 9) === Math.floor(select / 9)) { return true; }
		if (cell % 9 === select % 9) { return true; }
		const cellBlock = Math.floor(cell / 27) * 3 + Math.floor(cell % 9 / 3);
		const selectBlock = Math.floor(select / 27) * 3 + Math.floor(select % 9 / 3);
		return (cellBlock === selectBlock);
	}

	renderBoard() {
		return (
			<div className='GamePage__board col'>
				{[...Array(3)].map((_, i) => this.renderBoardRow(i))}
			</div>
		);
	}

	renderBoardRow(boardRow) {
		return (
			<div className='GamePage__board-row row' key={boardRow}>
				{[...Array(3)].map((_, i) => this.renderBoardBlock(boardRow * 3 + i))}
			</div>
		);
	}

	renderBoardBlock(block) {
		return (
			<div className='GamePage__block col' key={block}>
				{[...Array(3)].map((_, i) => this.renderBlockRow(block, i))}
			</div>
		);
	}

	renderBlockRow(block, row) {
		return (
			<div className='GamePage__block-row row' key={row}>
				{[...Array(3)].map((_, i) => this.renderBlockCell(block, row, i))}
			</div>
		);
	}

	renderBlockCell(block, row, col) {
		const { memoMode, select, ...state } = this.state;
		const cell = Math.floor(block / 3) * 27 + block % 3 * 3 + row * 9 + col;

		let cellClass = (memoMode)
			? 'GamePage__board-cell cell-memo-mode'
			: 'GamePage__board-cell';
		if (select === cell) {
			cellClass += ' select';
		}
		else if (select !== null) {
			if (state[cell].value && state[cell].value === state[select].value) {
				cellClass += ' select-value'
			}
			else if (this.isRelativeCell(cell, select)) {
				cellClass += ' relative';
			}
			else { cellClass += ' other-cells'; }
		}

		const cellValueClass = (state[cell].is_default)
			? 'GamePage__cell-value row default'
			: (state[cell].has_conflict)
				? 'GamePage__cell-value row conflict'
				: 'GamePage__cell-value row';
		
		return (
			<div className={cellClass} key={cell}>
				{[...Array(3)].map((_, i) => 
					<div className='GamePage__memo-row row' key={`memo-row-${i}`}>
						{[...Array(3)].map((_, j) => this.renderCellMemo(cell, i * 3 + j))}
					</div>
				)}
				<div 
					className={cellValueClass}
					tabIndex={cell + 1}
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

	renderButtons() {
		let memoClass = (this.state.memoMode)
			? 'GamePage__memo-btn mode-on'
			: 'GamePage__memo-btn';

		return (
			<div className='GamePage__panel-row'>
				<button 
					className='GamePage__undo' 
					onClick={e => this.onClickUndoOrRedo('UNDO')}
				>
					Undo
				</button>
				<button className={memoClass} onClick={e => this.onClickMemo()}>
					memo
				</button>
				<button 
					className='GamePage__redo' 
					onClick={e => this.onClickUndoOrRedo('REDO')}
				>
					Redo
				</button>
			</div>
		);
	}

	renderDigits() {
		const { memoMode, select, ...state } = this.state;
		return (
			<div className='GamePage__digits row'>
				{[...Array(9)].map((_, i) => {
					const digitClass = (memoMode) 
						? (select !== null && state[select].memos[i])
							? 'GamePage__digit-memo-select' 
							: 'GamePage__digit-memo' 
						: 'GamePage__digit';
					return (
						<button 
							key={i}
							className={digitClass}
							onClick={e => this.onClickDigit(i + 1)}
						>
							{i + 1}
						</button>
					);
				})}
			</div>
		);
	}

	render() {
		const { duration, memoMode, showModal } = this.state;

		return (
			<section className='GamePage'>
				<div className='GamePage__timer'>
					{duration.as('hours') < 1
						? moment.utc(duration.as('milliseconds')).format('mm : ss')
						: moment.utc(duration.as('milliseconds')).format('HH : mm : ss')
					}
				</div>
				{this.renderBoard()}
				<div className='GamePage__panel col'>
					{this.renderButtons()}
					{this.renderDigits()}
					{memoMode && (
						<div className='GamePage__note'>
							Allow multiple numbers in cells
						</div>
					)}
				</div>
				<div className='GamePage__intro'>
					<h2>HOW TO PLAY</h2>
					<p>
						Sudoku is a popular Japanese puzzle game based on the logical placement 
						of digits from 1 to 9.
					</p>
					<p>
						To win the game, you need to fill in all empty cells so that:
					</p>
					<ul>
						<li>Each row contains exactly one of every digit from 1 to 9.</li>
						<li>Each column contains exactly one of every digit from 1 to 9.</li>
						<li>Each section (3 * 3 cells) contains exactly one of every digit from 1 to 9.</li>
					</ul>
				</div>
				<Modal 
					showModal={showModal}
					onCloseModal={this.onCloseModal}
					onClickNewGame={this.onClickNewGame}
				/>
			</section>
		);
	}
}