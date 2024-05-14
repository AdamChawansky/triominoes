/*
https://en.wikipedia.org/wiki/Triominoes
gameBoard.has("0,0");
gameBoard.get("0,0");
gameBoard.keys();
gameBoard.values();
gameBoard.entries();

Clickable draw pile (bottom right)
Should game auto-pass for you when you've drawn MAX_TILES and have no play?

Add ability to play solitaire
Add ability to play versus computer
Add ability to play versus another human (like Paul's Avalon site)

KNOWN BUGS:
- 

- investigate scoring

End states:
  1) A player plays their last tile (any hand[i] === 0)
     That player earns 25 points + the total points of everyone else's tiles
  2) The drawPile is empty and all players pass, meaning no more moves possible.
     Each player loses points equal to sum of their own tiles




*/