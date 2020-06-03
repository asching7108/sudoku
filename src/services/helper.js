import TokenService from './token-service';

export function options(options) {
	if (TokenService.hasAuthToken()) {
		if (!options) {
			return {
				headers: {
					'authorization': `Bearer ${TokenService.getAuthToken()}`
				}
			};
		}
		options.headers['authorization'] = `Bearer ${TokenService.getAuthToken()}`;
	}	
	return options;
}