const board = document.getElementById("board");

//each item object stores values that affect the game's difficulty
const dif = {
  easy: {
    boardSize: 6,
    mines: 6,
    scoreNeeded: 30
  },
  med: {
    boardSize: 10,
    mines: 20,
    scoreNeeded: 80
  },
  hard: {
    boardSize: 13,
    mines: 40,
    scoreNeeded: 129
  }
}
//default difficulty is medium on load
let boardSize = dif.med.boardSize;
let mines = dif.med.mines;
let scoreNeeded = dif.med.pointsNeeded;

createBoard();

//Changes certain values that affect the game's difficulty before running the creatBoard function, such as board size, number of mines, and the number of points needed to win
$('#easy').on('click', function(evt) {
  boardSize = dif.easy.boardSize;
  mines = dif.easy.mines;
  scoreNeeded = dif.easy.scoreNeeded;
  createBoard();
});

$('#medium').on('click', function(evt) {
  boardSize = dif.med.boardSize;
  mines = dif.med.mines;
  scoreNeeded = dif.med.scoreNeeded;
  createBoard();
});

$('#hard').on('click', function(evt) {
  boardSize = dif.hard.boardSize;
  mines = dif.hard.mines;
  scoreNeeded = dif.hard.scoreNeeded;
  createBoard();
});

//resets values such as score and win/loss, and enables clicking events on the game board, while deleting the game board before recreating it at the size that matches the selected difficulty.  All of the cells are given an ID based on their x and y position on the board.  Runs the createMine function after the board is created
function createBoard(){
  $("#board").html("");
  $("#board").css("pointer-events", "auto");
  $("#status").html("Welcome to Minesweeper");
  $("#score").html(`Score: ${score = 0}`)
  for(let x = 0; x < boardSize; x++){
    row = board.insertRow(x);
    for(let y = 0; y < boardSize; y++){
      cell = row.insertCell(y);
      cell.id = `${x} ${y}`;
      let mine = document.createAttribute("hidden-mine");
      mine.value = false;
      cell.setAttributeNode(mine);
    }
  }
  $('td').on('click', function(evt) {
    clickCell(evt.target);
  });

  $('td').on('contextmenu', function(evt) {
    evt.preventDefault();
    markCell(evt.target);
  });
  
  createMines();
}

//only assigns a mine to a cell that does not already have a mine, and only progresses the outermost for loop when a mine is assigned
function createMines(){
  for(let idx = 0; idx < mines; idx = idx){
    let row = Math.floor(Math.random() * boardSize);
    let column = Math.floor(Math.random() * boardSize);
    let cell = board.rows[row].cells[column];
    for(let x = 0; x < boardSize; x++){
      for(let y = 0; y < boardSize; y++){
        if(cell.getAttribute("hidden-mine") != "true"){
          cell.setAttribute("hidden-mine","true");
          idx++
        }
      }
    }
  }
}

//finds every cell with the "hidden-mine" attribute and reveals them, while disabling the ability to click cells.  Only the difficulty buttons are able to be clicked.
function showMines(){
  for(let x = 0; x < boardSize; x++){
    for(let y = 0; y < boardSize; y++){
      let cell = board.rows[x].cells[y];
      if(cell.getAttribute("hidden-mine") == "true"){
        cell.className = "mine";
      }
    }
  }
  $("#board").css("pointer-events", "none");
}

//displays a win message and disables any cells from being clicked.  Only the difficulty buttons are able to be clicked
function checkWin(){
  if(score === scoreNeeded){
    $("#status").html("You Win");
    $("#board").css("pointer-events", "none");
  }
}

function markCell(cell){
  //will only mark cells that have not been revealed
  if(cell.innerHTML == ""){
    cell.classList.toggle("marked");
  }
}

//clickCell first checks to see if the clciked cell has the "hidden-mine" attribute.  If it does, a game over message will display, and the showMines function will run.
function clickCell(cell){
  if(cell.getAttribute("hidden-mine") == "true"){
    $("#status").html("Game Over");
    showMines();
  }else{
//if the selected cell does not have a mine, it is given the "clicked" class, the player's score is increased by 1.
    cell.classList.remove("marked");
    cell.classList.add("clicked");
    $("#score").html(`Score: ${score+=1}`);
//the cell's id is split into two variables, each representing it's x and y coordinate, respectively. For loops are used to check all of the adjacent cells to see if they have the "hidden-mine" attribute.  For every cell that does, adjMine's value is increased by 1.  After the cells are checked, adkMine's value is printed to the cell 
    let adjMines = 0;
    let coord = cell.id.split(" ");
    let cellX = parseInt(coord[0]);
    let cellY = parseInt(coord[1]);
    //Math.max and Math.min prevent errors when checking edge cells
    for(let x = Math.max((cellX - 1),0); x <= Math.min((cellX + 1),(boardSize-1)); x++){
      for(let y = Math.max((cellY - 1),0); y <= Math.min((cellY + 1),(boardSize-1)); y++){
        if(board.rows[x].cells[y].getAttribute("hidden-mine") == "true"){
           adjMines++;
        }
      }
    }
    cell.innerHTML = adjMines;
    //recurs the clickedCell function if there are no adjacent mines to the last clicked cell.  Automatically reveals all adjacent cells, and repeats until there is a mine adjecent to a revealed cell
    if(adjMines == 0){
      for(let x = Math.max((cellX - 1),0); x <= Math.min((cellX + 1),(boardSize-1)); x++){
        for(let y = Math.max((cellY - 1),0); y <= Math.min((cellY + 1),(boardSize-1)); y++){
          if(board.rows[x].cells[y].innerHTML == ""){
            clickCell(board.rows[x].cells[y]);
          }
        }
      }
    }
  }
  //checks against the win condition after every reveal
  checkWin();
}
