utils = {

	urlHasScheme: function(url) {
		schemeRegex = /^((https?|t?ftps?|mailto|data|wss?):)?\/\//i
		return schemeRegex.test(url);
	},

	fromRadix: function(HexN, alphabet) {
		var radix = alphabet.length;
		var power = HexN.length - 1;
		var N = 0;
		for (var i=0; i<HexN.length; i++) {
			N += alphabet.indexOf(HexN[i]) * Math.pow(radix,power);
			power--;
		}

		return N;
	},

	toRadix: function(N, alphabet) {
		var radix = alphabet.length;
		var HexN="", Q=Math.floor(Math.abs(N)), R;
		while (true) {
			R=Q%radix;
			HexN = alphabet.charAt(R) + HexN;
			Q=(Q-R)/radix;
			if (Q==0) break;
		}

		return ((N<0) ? "-"+HexN : HexN);
	}
};

module.exports = utils;
