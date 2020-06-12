import React, { Component } from 'react';
import { ButtonsDiv } from '../Utils/Utils';
import './Modal.css';

export default class Modal extends Component {
	static defaultProps = {
		showModal: false,
		onCloseModal: () => {},
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

	onClickStay = () => {
		this.setState({ showButton: false });
		this.props.onCloseModal();
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
					<ButtonsDiv className={`Modal__btn-div ${(showButton) ? 'b-shown' : 'b-hidden'}`}>
						<button className='Modal__btn' onClick={this.onClickStay}>
							Stay on Page
						</button>
						<button className='Modal__btn' onClick={this.props.onClickNewGame}>
							New Game
						</button>
					</ButtonsDiv>
			</>
		);
	}
}
