import config from '../config';
import { options } from './helper';

const PuzzlesApiService = {
	getRandomPuzzleId(lv) {
		return fetch(`${config.API_BASE_URL}/puzzles?level=${lv}`, options())
			.then(res => 
				(!res.ok)
					? res.json().then(e => Promise.reject(e))
					: res.json()
			);
	}
};

export default PuzzlesApiService;