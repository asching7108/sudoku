import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default class HomePage extends Component {
	render() {
		return (
			<section className='HomePage'>
				<Link to='/new' className='HomePage__btn'>New Game</Link>
			</section>
		);
	}
}