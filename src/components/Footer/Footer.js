import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Footer.css';

export default function Footer() {
	return (
		<footer className='Footer col'>
			<p className='Footer__author'>
				{'Created by '}
				<a href='http://asching7108.github.io/portfolio' target='_blank' rel="noopener noreferrer">
					Esther Lin
				</a>
			</p>
			<div>
				<a href="https://github.com/asching7108/sudoku-client/" target="_blank" rel="noopener noreferrer" className='Footer__icon'>
					<FontAwesomeIcon icon={['fab', 'github']} />
				</a>
				<a href='http://www.linkedin.com/in/esther-lin-tw/' target='_blank' rel="noopener noreferrer" className='Footer__icon'>
					<FontAwesomeIcon icon={['fab', 'linkedin']} />
				</a>
			</div>
			<p className='Footer__copyright'>Copyright ©2020</p>
		</footer>
	);
}