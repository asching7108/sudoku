import config from '../config';
import TokenService from './token-service';

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

function options(options) {
	if (TokenService.hasAuthToken()) {
		options.header['authorization'] = `Bearer ${TokenService.getAuthToken()}`;
	}
	return options;
}

export default PuzzlesApiService;