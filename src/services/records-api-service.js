import config from '../config';
import { options } from './helper';

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
	getRecordById(record_id) {
		return fetch(`${config.API_BASE_URL}/records/${record_id}`, options())
			.then(res => 
				(!res.ok)
				? res.json().then(e => Promise.reject(e))
				: res.json()
			);
	},

	postRecordStep(record_id, steps) {
		return fetch(`${config.API_BASE_URL}/records/${record_id}/steps`, options({
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ steps: steps })
		}))
			.then(res => 
				(!res.ok)
					? res.json().then(e => Promise.reject(e))
					: res.json()
			);
	},

	updateRecordStep(record_id, edit_type) {
		return fetch(
			`${config.API_BASE_URL}/records/${record_id}/steps`, options({
				method: 'PATCH',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ edit_type: edit_type })
		}))
			.then(res => 
				(!res.ok)
					? res.json().then(e => Promise.reject(e))
					: res.json()
			);
	}
};

export default RecordsApiService;