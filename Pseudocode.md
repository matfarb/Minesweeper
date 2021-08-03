START
SET board to 10 rows by 10 cloumns
INIT score = 0
INIT timer = 0:00
INCREMENT timer

FOR 1 TO 20
  place 20 mines at random unique cells
ENDFOR

INPUT player left clicks a cell

IF the clicked cell is not a mine THEN
  INCREMENT Score
  PRINT the number of mines adjacent to the cell
  IF number of adjacent cells with mines === 0 THEN
    reveal all adjacent mines and repeat the process
  ENDIF
ELSE
  PRINT "Game Over"
  Reveal all of the mines
  Stop the timer
  disable pointer events on board
ENDIF

INPUT player right clicks a cell

IF the cell has not been revealed THEN
  mark the cell blue
ENDIF

IF score === 80 THEN
  PRINT "You win"
  Reveal all of the mines
  Stop the timer
  disable pointer events on board
ENDIF

IF player has clicked the reset button THEN
  delete and create a new 10x10 board
  score = 0
  timer = 0:00
  INCREMENT timer
  FOR 1 TO 20
    place 20 mines at random unique cells
  ENDFOR
  remove "you win" and "game over"
ENDIF



