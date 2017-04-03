(function() {
  angular.module('TicTacToeApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']).controller('TicTacToeController', function($scope) {
    var vm;
    var victorySign = false;
    vm = $scope;
    vm.board = [];
    vm.handleCellClick = handleCellClick;
    vm.currentSign = ""; // Determine what sign is currently used, "O" or "X"
    vm.AISign = "O";
    vm.playerSign = "X";
    vm.wonNumber = 3; // Depend on type of game, Tic Tac Toe should be 3
    vm.boardSize = 3;
    vm.found = [];
    vm.currentSign = vm.AISign;
    var messages = ["X won", "O won", "Draw"];
    vm.message = "";
    function checkVictoryCol(rowIndex, colIndex) {
        // We keep colIndex, go through rowIndex
        // To preform a column of wonNumber*sign, we check gradually the neighbour of this cell 
        var board = vm.board;
        var cellSign = board[rowIndex][colIndex];
        var victoryPattern = "";
        var i = 0;
        var upCellPattern = "";
        var upIndexList = [[rowIndex, colIndex]], downIndexList = [[rowIndex, colIndex]], betweenIndexList = [[rowIndex, colIndex]];
        var downCellPattern = "";
        var betweenPattern = cellSign;
       
        while(i < vm.wonNumber){
            victoryPattern += cellSign;
            if (board[rowIndex - i]) {
                upCellPattern += board[rowIndex - i][colIndex];
            }else {
                upCellPattern += String(board[rowIndex - i]);
            }
            if (board[rowIndex + i]) {
                downCellPattern += board[rowIndex + i][colIndex];
            }else {
                downCellPattern += String(board[rowIndex + i]);
            }
            upIndexList.push([rowIndex - i, colIndex]);
            downIndexList.push([rowIndex + i, colIndex]);
            i++;
        }
        var j = 0;
        while(j < ((vm.wonNumber - 1) % 2) ) {
            var left = "", right = "";
            if (board[rowIndex + j]) {
                left = board[rowIndex + j][colIndex];
            }
            if(board[rowIndex - j]) {
                right = board[rowIndex - j][colIndex];
            }
            betweenPattern = board[rowIndex + j][colIndex] + betweenPattern + board[rowIndex - j][colIndex];
            betweenIndexList.push([rowIndex + j,colIndex]);
            betweenIndexList.push([rowIndex - j,colIndex]);
            j++;
        }
        if (upCellPattern === victoryPattern) {
            vm.found = upIndexList;
            return true;
        }
        else if (betweenPattern === victoryPattern) {
            vm.found = betweenIndexList;
            return true;
        }
        else if (downCellPattern === victoryPattern) {
            vm.found = downIndexList;
            return true;
        }
        else {
            return false;
        }
    }
    function checkVictoryCondition() {
        var board = vm.board;
        var i = 0, j = 0;
        while(i < vm.boardSize){
            while(j < vm.boardSize){
                if(board[i][j] !== ""){
                    victorySign = checkVictoryCol(i, j);
                    if (victorySign) {
                        return true;
                    }
                }
                j++;
            }
            i++;
        }
        return false;
    }

    function checkVictoryDiagonal() {
        
    }

    function checkVictoryRow() {
        
    }
    function handleCellClick(rowIndex,colIndex) {
        if(vm.board[rowIndex][colIndex] === "") {
            vm.board[rowIndex][colIndex] = vm.currentSign;
        }
    };

    function makeBoard(size) {
        var board, i, j, row;
        board = [];
        i = 0;
        j = 0;
        while (i < size) {
            j = 0;
            row = [];
            while (j < size) {
                row.push("");
                j++;
            }
            board.push(row);
            i++;
        }

        console.log(board);
        return board;
    };

    vm.board = makeBoard(3);
    });
}).call(this);
