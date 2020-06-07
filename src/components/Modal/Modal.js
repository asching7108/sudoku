import React, { Component } from 'react';
import './Modal.css';

export default class Modal extends Component {
	static defaultProps = {
		showModal: false,
		onClickNewGame: () => {}
	};

	constructor(props) {
		super(props);
		this.state = { showButton: false };
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.showModal && this.props.showModal) {
			setTimeout(() => { this.setState({ showButton: true }); }, 2000);
		}
	}

	render() {
		const { showModal } = this.props;
		const { showButton } = this.state;
		return (
			<>
				<div className={`Modal__overlay ${(showButton) ? 'ol-shown' : 'ol-hidden'}`} />
					<h2 className={`Modal__text ${(showModal) ? 't-shown' : 't-hidden'}`}>
						Congratulations!
					</h2>
					<button 
						className={`Modal__btn ${(showButton) ? 'b-shown' : 'b-hidden'}`}
						onClick={this.props.onClickNewGame}
					>
						New Game
					</button>
			</>
		);
	}
}
