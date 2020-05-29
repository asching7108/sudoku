import config from '../config';
import TokenService from './token-service';

const RecordsApiService = {
	postRecord(puzzle_id) {
		return fetch(`${config.API_BASE_URL}/records`, options({
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ puzzle_id: puzzle_id })
		}))
			.then(res => 
				(!res.ok)
					? res.json().then(e => Promise.reject(e))
					: res.json()
			);
	},
	getRecordById(recordId) {
		return fetch(`${config.API_BASE_URL}/records/${recordId}`, options())
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

export default RecordsApiService;