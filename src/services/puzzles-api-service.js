import config from '../config';

const PuzzlesApiService = {
	pingServer() {
		return fetch(`${config.API_BASE_URL}`)
			.then(res =>
				(!res.ok)
					? res.json().then(e => Promise.reject(e))
					: res.json()
			);
	},

	getRandomPuzzleId(lv) {
		return fetch(`${config.API_BASE_URL}/api/puzzles?level=${lv}`)
			.then(res => 
				(!res.ok)
					? res.json().then(e => Promise.reject(e))
					: res.json()
			);
	}
};

export default PuzzlesApiService;