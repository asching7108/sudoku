import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
	return (
		<section className='HomePage'>
			<div className='HomePage__btn-box col'>
				<Link to='/new' className='HomePage__btn'>New Game</Link>
			</div>
		</section>
	);
}