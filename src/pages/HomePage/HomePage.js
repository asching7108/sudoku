import React, { Component } from 'react';
import { LinkButton } from '../../components/Utils/Utils';
import './HomePage.css';

export default class HomePage extends Component {
	render() {
		return (
			<section className='HomePage'>
				<LinkButton to='/new'>New Game</LinkButton>
			</section>
		);
	}
}