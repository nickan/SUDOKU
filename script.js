import { Sudoku } from "./sudoku.js";
import { BOX_SIZE, GRID_SIZE } from "./utilities.js";
import { convertIndexToPosition, convertPositionToIndex } from "./utilities.js";

const sudoku = new Sudoku();
let cells;
let selectedCellIndex;
let selectedCell;
init();

function init() {
  initCells();
 initNumbers();
 initRemover();
}

function initCells() {
  cells = document.querySelectorAll('.cell');
  fillCells();
  initCellsEvent();
}

function fillCells() {
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const { row, column } = convertIndexToPosition(i);

    if (sudoku.grid[row][column] !== null) {
      cells[i].classList.add('filled');
      cells[i].innerHTML = sudoku.grid[row][column];
    }
  }
}

function initCellsEvent() {
  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => onCellClick(cell, index));
  });
}

function onCellClick(clickedCell, index) {
  cells.forEach(cell => cell.classList.remove('selected', 'highLighted','error'));
  if (clickedCell.classList.contains('filled')) {
    selectedCellIndex = null;
    selectedCell = null;
  } else {
    selectedCellIndex = index;
    selectedCell = clickedCell;
    clickedCell.classList.add('selected');
    highLightCellBy(index);
  }

  if(clickedCell.innerHTML==='')return;
  cells.forEach(cell=>{
    if(cell.innerHTML===clickedCell.innerHTML) cell.classList.add('selected');
  });
}


function highLightCellBy(index) {
  highLightColumnBy(index);
  highLightRowBy(index);
  highLightBoxBy(index);

}

function highLightColumnBy(index) {
  const column = index % GRID_SIZE;
  for (let row = 0; row < GRID_SIZE; row++) {
    const cellIndex = convertPositionToIndex(row, column);
    cells[cellIndex].classList.add('highLighted');

  }
}
function highLightRowBy(index) {
  const row = Math.floor(index / GRID_SIZE);
  for (let column = 0; column < GRID_SIZE; column++) {
    const cellIndex = convertPositionToIndex(row, column);
    cells[cellIndex].classList.add('highLighted');

  }
}
function highLightBoxBy(index) {
  const column = index % GRID_SIZE;
  const row = Math.floor(index / GRID_SIZE);
  const firstRowInBox = row - row % BOX_SIZE;
  const firstColumnInBox = column - column % BOX_SIZE;

  for (let iRow = firstRowInBox; iRow < firstRowInBox + BOX_SIZE; iRow++) {
    for (let iColumn = firstColumnInBox; iColumn < firstColumnInBox + BOX_SIZE; iColumn++) {
      const cellIndex = convertPositionToIndex(iRow, iColumn);
      cells[cellIndex].classList.add('highLighted');
    }
  }
}

function initNumbers(){
  const numbers = document.querySelectorAll('.number');
  numbers.forEach(number =>{
    number.addEventListener('click',()=>onNumberClick(parseInt(number.innerHTML)));
  });
}

function onNumberClick(number){
if(!selectedCell)return;
if(selectedCell.classList.contains('filled'))return;

cells.forEach(cell=>cell.classList.remove('error','shake','zoom','selected'));
selectedCell.classList.add('selected');
setValueInSelectedCell(number);
}

function setValueInSelectedCell(value){
const{row,column}=convertIndexToPosition(selectedCellIndex);
const dulicatesPositions= sudoku.getDuplicatePositions(row,column,value);
if(dulicatesPositions.length){
  highLightDuplicates(dulicatesPositions);
  return;
}
sudoku.grid[row][column]=value;
selectedCell.innerHTML=value;
setTimeout(()=>selectedCell.classList.add('zoom'),0);
}

function highLightDuplicates(dulicatesPositions){
  dulicatesPositions.forEach(dulicate=>{
    const index = convertPositionToIndex(dulicate.row,dulicate.column);
    setTimeout(()=>cells[index].classList.add('error','shake'),0);
  })
}

function initRemover(){

}