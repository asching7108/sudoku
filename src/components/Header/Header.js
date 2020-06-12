import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
	return (
		<nav className='Header'>
			<Link to='/' className='Header__logo'>Sudoku</Link>
			<div className='Header__div' />
		</nav>
	);
}