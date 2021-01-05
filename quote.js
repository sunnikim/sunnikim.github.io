var quotes = [
'ah, finally some peace and quiet.',
'love :)',
'hello',
'goodbye',
'yes',
'no',
'maybe',
'so',
'pie',
'sigh',

]

function newQuote() {
	var randomNumber = Math.floor(Math.random() * (quotes.length));
	document.getElementById('quotesDisplay').innerHTML = quotes[randomNumber];
}
