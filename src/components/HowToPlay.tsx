import './HowToPlay.css'

export function HowToPlayButton(props: {
  onClick: () => void;
}) {
  return (
    <button className="how-to-play-button" onClick={props.onClick}>
      HOW TO PLAY
    </button>
  );
}

export function HowToPlayPopup(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isOpen, onClose } = props;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
            <h2>How to Play Triominoes</h2>
            <span className="close-btn" onClick={onClose}>
                &times;
            </span>
        </div>

        <div className="wikipedia-content">
            <h2>Setup and initial move</h2>
                <p>At the start of the game, all of the tiles are placed face down and shuffled. Players randomly draw their starting pieces. The specific number depends upon
                the number of players: a two-player game uses nine pieces per player to start, three or four players use seven pieces, and five or six players use six pieces.
                The tiles after the draw are kept face-down for later use.</p>
                <p>One player keeps score for all, using columns for each player and cumulative scores.</p>
                <p>The player who draws the largest "triple" (all three numbers the same on the tile), begins the game by placing that tile. That player scores 10 points plus
                the total value of the tile. The exception is that if the triple zero tile is used to start, that player earns 40 points. In this case, the only triple tile held is the
                triple zero, which would otherwise be trumped by any other triple tile.</p>
                <p>If no triple is held by any player, the player with the highest single tile value plays it and scores its value without the 10 point bonus. Tile values are
                computed by summing the three numbers. For example, the 2-4-5 tile is worth 2+4+5=11 points. When two or more players hold tiles with the same
                summed value, the next highest counts and so on until there is the highest value tile.</p>
                
                <div className="gallery">
                  <div className="gallery-caption">Starting examples</div>
                  <div className="gallery-items">
                    <div className="gallery-item">
                      <div className="gallery-item-thumb">
                        <img
                          src="//upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Triominoes_4-4-4.svg/112px-Triominoes_4-4-4.svg.png"
                          alt="Placing a triple-4 tile to start gives the player a score of 22 points (4×3 + 10 point bonus)"
                        />
                      </div>
                      <div className="gallery-item-text">
                        Placing a triple-4 tile to start gives the player a score of 22 points (4×3 + 10 point bonus)
                      </div>
                    </div>
                    <div className="gallery-item">
                      <div className="gallery-item-thumb">
                        <img
                          src="//upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Triominoes_0-0-0.svg/112px-Triominoes_0-0-0.svg.png"
                          alt="Placing a triple-0 tile to start gives the player a score of 40 points (30 points for triple-0 + 10 point bonus)"
                        />
                      </div>
                      <div className="gallery-item-text">
                        Placing a triple-0 tile to start gives the player a score of 40 points (30 points for triple-0 + 10 point bonus)
                      </div>
                    </div>
                    <div className="gallery-item">
                      <div className="gallery-item-thumb">
                        <img
                          src="//upload.wikimedia.org/wikipedia/commons/thumb/5/54/Triominoes_2-4-5.svg/112px-Triominoes_2-4-5.svg.png"
                          alt="Placing a 2-4-5 tile to start gives the player a score of 11 points (2+4+5, no bonus)"
                        />
                      </div>
                      <div className="gallery-item-text">
                        Placing a 2-4-5 tile to start gives the player a score of 11 points (2+4+5, no bonus)
                      </div>
                    </div>
                  </div>
                </div>
                
            <h2>Tile Placement</h2>
              <div className="gallery">
                <div className="gallery-caption">Legal placement examples</div>
                <div className="gallery-items">
                  <div className="gallery-item">
                    <div className="gallery-item-thumb">
                      <img
                        src="//upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Triominoes_placement_example_01.svg/200px-Triominoes_placement_example_01.svg.png"
                        alt="The legal placement of the 3-4-4 tile scores 3+4+4=11 points. Note how the corner values are matched to the adjacent 4-4-4 tile."
                      />
                    </div>
                    <div className="gallery-item-text">
                      The legal placement of the 3-4-4 tile scores 3+4+4=11 points. Note how the corner values are matched to the adjacent 4-4-4 tile.
                    </div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-item-thumb">
                      <img
                        src="//upload.wikimedia.org/wikipedia/commons/thumb/3/38/Triominoes_placement_example_02.svg/200px-Triominoes_placement_example_02.svg.png"
                        alt="The legal placement of the 2-5-5 tile scores 12 points."
                      />
                    </div>
                    <div className="gallery-item-text">
                      The legal placement of the 2-5-5 tile scores 12 points.
                    </div>
                  </div>
                </div>
              </div>
              <p>Play proceeds clockwise; each player places a tile from their hand that lines up with the already placed tiles. A valid play of a triomino is similar to that of a
              domino in that the sides contacting each other must have matching numbers; this means the two numbers at the corners must match with the adjacent
              tile. A side with a 1 and a 2 will often not match the side the player is attempting to match. If a new tile is being placed such that it would touch two other
              tiles, then all of the adjacent numbers must match. Where the points of tiles meet the numbers must always be the same; if they are not, someone has been
              allowed to misplace a tile and the round must be restarted.</p>
              <p>Points are scored based on the numbers on the tile played, with additional bonuses applied when special placements are made. After a tile has been placed
              legally, each number on the newly placed tile is summed and added to that player's score. (E.g. 5 + 3 + 1 = 9).</p>
            <h2>Drawing Penalty</h2>
              <p>If a player cannot place a piece using the tiles in their hand, they must draw a new piece from the remaining pile. Each tile drawn penalizes the player 5
              points. Players must continue to draw until a matching tile is found or until they have drawn three tiles. If one of the three can be placed the score is the
              value of the tile placed less the penalty, which may be positive or negative, depending on the placed tile value and number of tiles drawn. If none of these
              three tiles can be placed the penalty is 25 points.</p>
              <p>If there are no remaining tiles left to be drawn and a player is unable to place a tile, they lose 10 points. For example, if there are two tiles left, a player
              without a tile to be placed may draw them (receiving a penalty -10 in total for the two tiles drawn), and if that player still has no tile that can be played, the
              additional end penalty is incurred (total penalty -10 + -10).</p>
                    
            <h2>Bonus Points</h2>
              <p>When a player can place a tile that completes a closed hexagonal shape (i.e. the 6th piece & all 3 numbers match), that player receives a bonus of 50 points
              plus the regular score for a legally placed tile, less any penalty if pieces have been drawn. If a player completes two hexagons in one move the player
              receives a 100 point bonus.</p>
              <p>Bridges are made by matching one side of the tile and the point opposite. If a bridge is completed or a tile is added to a bridge, that player receives a 40-
              point bonus in addition to the tile's points, less any penalty if pieces have been drawn.</p>
              <div className="gallery">
                <div className="gallery-caption">Bonus placement examples</div>
                <div className="gallery-items">
                  <div className="gallery-item">
                    <div className="gallery-item-thumb">
                      <img
                        src="//upload.wikimedia.org/wikipedia/commons/thumb/7/79/Triominoes_placement_example_03.svg/165px-Triominoes_placement_example_03.svg.png"
                        alt="The completion of the hexagon with the 0-5-5 tile scores 0+5+5 + 50 (bonus) = 60 points in total. Note how all three values on the placed 0-5-5 tile must match the two adjacent tiles."
                      />
                    </div>
                    <div className="gallery-item-text">
                      The completion of the hexagon with the 0-5-5 tile scores 0+5+5 + 50 (bonus) = 60 points in total. Note how all three values on the placed 0-5-5 tile must match the two adjacent tiles.
                    </div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-item-thumb">
                      <img
                        src="//upload.wikimedia.org/wikipedia/commons/thumb/8/87/Triominoes_placement_example_04.svg/139px-Triominoes_placement_example_04.svg.png"
                        alt="The completion of the bridge with the 1-4-4 tile scores 1+4+4 + 40 (bonus) = 49 points in total. Note how the corner value 1 must match the adjacent corners."
                      />
                    </div>
                    <div className="gallery-item-text">
                      The completion of the bridge with the 1-4-4 tile scores 1+4+4 + 40 (bonus) = 49 points in total. Note how the corner value 1 must match the adjacent corners.
                    </div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-item-thumb">
                      <img
                        src="//upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Triominoes_placement_example_05.svg/200px-Triominoes_placement_example_05.svg.png"
                        alt="The completion of the bridge with the 1-2-5 tile scored 1+2+5+40 = 48 points. The bridge was then augmented with the 1-1-5 tile, which scored 1+1+5+40 = 47 points, as that player was required to match two adjacent sides."
                      />
                    </div>
                    <div className="gallery-item-text">
                      The completion of the bridge with the 1-2-5 tile scored 1+2+5+40 = 48 points. The bridge was then augmented with the 1-1-5 tile, which scored 1+1+5+40 = 47 points, as that player was required to match two adjacent sides.
                    </div>
                  </div>
                </div>
              </div>

            <h2>Round ending and objective</h2>
                <p>The round ends when no player can place a tile, whether or not all the face-down tiles have been drawn, or when one player runs out of tiles.</p>
                <ol>
                <li>When the round ends because no one can place a piece, then the player with the lowest total value hand gains the value in excess of their hand from
                each other player. For example, if the total value of the remaining tiles in Player B's hand is 15, while Player A's remaining hand sums to 23 and Player
                C's hand sums to 27, Player B will receive a total bonus of 20, which is the sum of the differences between B and A (23-15=8) and B and C (27-
                15=12).</li>
                <li>A player who is able to empty their hand and place their last tile receives 25 bonus points, plus the total of all of the remaining tiles in their opponent(s)'
                hands. This is consistent with the prior ending condition, as the player who emptied their hand has the lowest remaining total value (0).</li>
                </ol>
                <p>Additional rounds are played until one player reaches a total of 400 points. They are not yet the winner, and may not be: this only signals that this is the
                last round, even if penalties later reduce their total below 400. The winner is the one who has the most points at the end of this last round.</p>
                </div>
        </div>
    </div>
  );
}