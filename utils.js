utils = {

	urlHasScheme: function(url) {
		schemeRegex = /^((https?|t?ftps?|mailto|data|wss?):)?\/\//i
		return schemeRegex.test(url);
	}
};

module.exports = utils;
