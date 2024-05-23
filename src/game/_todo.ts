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
- investigate scoring (seems like you can get bridge/hexagon at same time)
- 

FOR LATER:
<<<<<<< HEAD
- Add PassAction & associated game logic
+- Make TileInHand draggable to GameBoard
+- Change onClick for TileInHand to rotate tile (and make them act like PlacedTiles)- Add ADMIN view that has all buttons, but regular game only has DRAW/PASS
=======
- Add ADMIN view that has all buttons, but regular game only has DRAW/PASS
---> Add visualization of how many tiles remain in draw pile
>>>>>>> b9db52e6d5ba62f19200c89b2ed017dada2c7d9a
- Figure out why right container takes up whole screen instead of collapsing when screen too narrow.
- Optimize for mobile & tablets
- Add ability for players to undo by selecting point in data log

End states:
  1) A player plays their last tile (any hand[i] === 0)
     That player earns 25 points + the total points of everyone else's tiles
  2) The drawPile is empty and all players pass, meaning no more moves possible.
     Each player loses points equal to sum of their own tiles




*/