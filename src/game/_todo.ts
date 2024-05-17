/*
https://en.wikipedia.org/wiki/Triominoes
gameBoard.has("0,0");
gameBoard.get("0,0");
gameBoard.keys();
gameBoard.values();
gameBoard.entries();

Clickable draw pile (bottom right)

Add ability to play solitaire
Add ability to play versus computer
Add ability to play versus another human (like Paul's Avalon site)

Homework:
- Try doing something in UI where I enter a room number
- Grab the room number from database
- Subscribing to updates... stay tuned!


KNOWN BUGS:
- 

FOR LATER:
- investigate scoring
- display room ID in top left corner, make it clickable so it copies URL to clipboard and auto-fills join room
- 

End states:
  1) A player plays their last tile (any hand[i] === 0)
     That player earns 25 points + the total points of everyone else's tiles
  2) The drawPile is empty and all players pass, meaning no more moves possible.
     Each player loses points equal to sum of their own tiles




*/