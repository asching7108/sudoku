import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import HomePage from '../routes/HomePage/HomePage';
import NewGamePage from '../routes/NewGamePage/NewGamePage';
import GamePage from '../routes/GamePage/GamePage';
import NotFoundPage from '../routes/NotFoundPage';

describe(`HomePage Component`, () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(
			<BrowserRouter>
				<HomePage />
			</BrowserRouter>, 
			div
		);
		ReactDOM.unmountComponentAtNode(div);
	})

	it('renders the UI as expected', () => {
		const wrapper = shallow(<HomePage />);
		expect(toJson(wrapper)).toMatchSnapshot();
	})
})

describe(`NewGamePage Component`, () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<NewGamePage />, div);
		ReactDOM.unmountComponentAtNode(div);
	})

	it('renders the UI as expected', () => {
		const wrapper = shallow(<NewGamePage />);
		expect(toJson(wrapper)).toMatchSnapshot();
	})
})

describe(`GamePage Component`, () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<GamePage />, div);
		ReactDOM.unmountComponentAtNode(div);
	})

	it('renders the UI as expected', () => {
		const wrapper = shallow(<GamePage />);
		expect(toJson(wrapper)).toMatchSnapshot();
	})
})

describe(`NotFoundPage Component`, () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<NotFoundPage />, div);
		ReactDOM.unmountComponentAtNode(div);
	})

	it('renders the UI as expected', () => {
		const wrapper = shallow(<NotFoundPage />);
		expect(toJson(wrapper)).toMatchSnapshot();
	})
})