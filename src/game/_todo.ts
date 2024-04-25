/*
https://en.wikipedia.org/wiki/Triominoes
gameBoard.has("0,0");
gameBoard.get("0,0");
gameBoard.keys();
gameBoard.values();
gameBoard.entries();

Add style for triangles
Render the hand (can hard code and refactor later)

- Score tracker (top left)
- Hand size indicator (top left)
- Visible hand at bottom
- Clickable draw pile (bottom right)
- Running game log (right side)

Add ability to play versus computer
Add ability to play versus another human (like Paul's Avalon site)


End states:
  1) A player plays their last tile (any hand[i] === 0)
     That player earns 25 points + the total points of everyone else's tiles
  2) The drawPile is empty and all players pass, meaning no more moves possible.
     Each player loses points equal to sum of their own tiles




*/