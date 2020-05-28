import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default class Header extends Component {
	render() {
		return (
			<>
				<nav className='Header'>
					<div className='Header__div'>
						<h1 className='Header__title'><Link to='/'>Sudoku</Link></h1>
					</div>
				</nav>
			</>
		);
	}
}