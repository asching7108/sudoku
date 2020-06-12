import React from 'react';
import { Link } from 'react-router-dom';
import './Utils.css';

export function Button({ className, ...props }) {
	return (
		<button className={['Button', className].join(' ')} {...props} />
	);
}

export function Input({ className, ...props }) {
	return (
		<input className={['Input', className].join(' ')} {...props} />
	);
}

export function Required({ className, ...props }) {
	return (
		<span className={['Required', className].join(' ')} {...props}>
			&#42;
		</span>
	);
}

export function LinkButton({ className, ...props }) {
	return (
		<Link className={['LinkButton Button', className].join(' ')} {...props} />
	);
}

export function ButtonsDiv({ className, ...props }) {
	return (
		<div className={['ButtonsDiv', className].join(' ')} {...props}>
			{props.children}
		</div>
	);
}