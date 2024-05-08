/*
https://en.wikipedia.org/wiki/Triominoes
gameBoard.has("0,0");
gameBoard.get("0,0");
gameBoard.keys();
gameBoard.values();
gameBoard.entries();

Add style for triangles
Clickable draw pile (bottom right)

May 4 HOMEWORK:
- on hover, instead of bold use invert triangle (set text white)
- click selects tile, click again deselects it
- click selects tile, click board places it (need to add click handler to blocks on board)


Add ability to play solitaire
Add ability to play versus computer
Add ability to play versus another human (like Paul's Avalon site)


- make Undo stop at INIT
- investigate scoring
- Add end game action -->

End states:
  1) A player plays their last tile (any hand[i] === 0)
     That player earns 25 points + the total points of everyone else's tiles
  2) The drawPile is empty and all players pass, meaning no more moves possible.
     Each player loses points equal to sum of their own tiles




*/