var quotes = [
'ah, finally some peace and quiet.',
'turn the volume down you&#8217;ll drown out the music',
'no one is better than you but you&#8217;re better than nobody',
'you don&#8217;t have to be special but you are special to me',
'i don&#8217;t want to be interesting, i wanna be interested',
'wisdom is knowing i am nothing, love is knowing i am everything, and between the two my life moves',
'its nothing to worry about but it definitely is sad',
'exit the simultion, see through the spectacle',
'questions you cannot answer are usually far better than answers you cannot question',
'i&#8217;ve learn i am here to help others, what i still haven&#8217;t figure out is why the other people are here',

]

function newQuote() {
	var randomNumber = Math.floor(Math.random() * (quotes.length));
	document.getElementById('quotesDisplay').innerHTML = quotes[randomNumber];
}
