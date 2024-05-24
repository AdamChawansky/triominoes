/*
https://en.wikipedia.org/wiki/Triominoes
gameBoard.has("0,0");
gameBoard.get("0,0");
gameBoard.keys();
gameBoard.values();
gameBoard.entries();

Homework:
- 

KNOWN BUGS:
- human players can play when it's not their turn!
- investigate scoring (seems like you can get bridge/hexagon at same time)
- 

FOR LATER:
- Add PassAction & associated game logic
- Change onClick for TileInHand to rotate tile (and make them act like PlacedTiles)- Add ADMIN view that has all buttons, but regular game only has DRAW/PASS
- Figure out why right container takes up whole screen instead of collapsing when screen too narrow.
- Optimize for mobile & tablets
- Create admin view
--> should display active player's hand
--> should have all buttons at top (vs. only Start Game --> Draw/Pass --> New Game)
- Add ability for players to undo by selecting point in data log

End states:
  1) A player plays their last tile (any hand[i] === 0)
     That player earns 25 points + the total points of everyone else's tiles
  2) The drawPile is empty and all players pass, meaning no more moves possible.
     Each player loses points equal to sum of their own tiles




*/