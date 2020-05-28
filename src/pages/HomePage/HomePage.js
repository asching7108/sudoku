import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default class HomePage extends Component {
	render() {
		return (
			<section className='HomePage'>
				<button><Link to='/new'>New Game</Link></button>
			</section>
		);
	}
}