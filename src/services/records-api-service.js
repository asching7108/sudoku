import config from '../config';

const RecordsApiService = {
	postRecord(puzzle_id) {
		return fetch(`${config.API_BASE_URL}/api/records`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ puzzle_id: puzzle_id })
		})
			.then(res => 
				(!res.ok)
					? res.json().then(e => Promise.reject(e))
					: res.json()
			);
	},
	getRecordById(record_id) {
		return fetch(`${config.API_BASE_URL}/api/records/${record_id}`)
			.then(res => 
				(!res.ok)
				? res.json().then(e => Promise.reject(e))
				: res.json()
			);
	},
	updateRecord(record_id, updateCols) {
		return fetch(
			`${config.API_BASE_URL}/api/records/${record_id}`, {
				method: 'PATCH',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ updateCols: updateCols })
		})
			.then(res => 
				(!res.ok)
					? res.json().then(e => Promise.reject(e))
					: res.json()
			);
	},

	postRecordStep(record_id, duration, steps) {
		return fetch(`${config.API_BASE_URL}/api/records/${record_id}/steps`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ duration: duration, steps: steps })
		})
			.then(res => 
				(!res.ok)
					? res.json().then(e => Promise.reject(e))
					: res.json()
			);
	},

	updateRecordStep(record_id, edit_type, duration) {
		return fetch(
			`${config.API_BASE_URL}/api/records/${record_id}/steps`, {
				method: 'PATCH',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ edit_type: edit_type, duration: duration })
		})
			.then(res => 
				(!res.ok)
					? res.json().then(e => Promise.reject(e))
					: res.json()
			);
	}
};

export default RecordsApiService;