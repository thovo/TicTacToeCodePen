(function() {
  angular.module('TicTacToeApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']).controller('TicTacToeController', function($scope) {
    var vm;  
    vm = $scope;
    vm.victorySign = false;
    vm.board = [];
    vm.handleCellClick = handleCellClick;
    vm.resetGame = resetGame;
    vm.currentSign = ""; // Determine what sign is currently used, "O" or "X"
    vm.AISign = "O";
    vm.playerSign = "X";
    vm.wonNumber = 3; // Depend on type of game, Tic Tac Toe should be 3
    vm.boardSize = 3;
    vm.found = [];
    vm.currentSign = vm.AISign;
    var messages = ["X won", "O won", "Draw"];
    vm.message = "";
    vm.emptyCell = (vm.boardSize*vm.boardSize); // Store available cell to play, stop game when don't have any space left
    vm.runningGame = true; // If false, stop the game
    vm.currentRowIndex = -1;
    vm.currentColIndex = -1;
    vm.playMode = 0; // 0 PVP, 1 PVB
    vm.logs = [];
    vm.colIndexArray = []; // Help us display a col index based on the size of the board

    // TODO: Implement turn based to play between two players

    function changePlayer() {
        return vm.currentSign === "O" ? vm.currentSign = "X" : vm.currentSign = "O";
    }

    function checkStopCondition() {
        if (vm.emptyCell === 0 || vm.victorySign) {
            vm.runningGame = false;
        }
    }

    function checkVictoryCol(rowIndex, colIndex) {
        // We keep colIndex, go through rowIndex
        // To preform a column of wonNumber*sign, we check gradually the neighbour of this cell 
        var board = vm.board;
        var cellSign = board[rowIndex][colIndex];
        var victoryPattern = "";
        var i = 0;
        var upCellPattern = "";
        var upIndexList = [], downIndexList = [], betweenIndexList = [];
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
        var j = 1;
        while(j <= ((vm.wonNumber - 1) % 2) ) {
            var up = "", down = "";
            if (board[rowIndex + j]) {
                down = board[rowIndex + j][colIndex];
            }
            if(board[rowIndex - j]) {
                up = board[rowIndex - j][colIndex];
            }
            betweenPattern = up + betweenPattern + down;
            betweenIndexList.push([rowIndex + j,colIndex]);
            betweenIndexList.push([rowIndex - j,colIndex]);
            j++;
        }
        if (upCellPattern === victoryPattern) {
            vm.found = upIndexList;
            vm.victorySign = true;
        }
        else if (betweenPattern === victoryPattern) {
            vm.found = betweenIndexList;
            vm.victorySign = true;
        }
        else if (downCellPattern === victoryPattern) {
            vm.found = downIndexList;
            vm.victorySign = true;
        }
        else {
            return false;
        }
    }

    function checkVictoryCondition(rowIndex, colIndex) {
        checkVictoryCol(rowIndex, colIndex);
        checkVictoryRow(rowIndex, colIndex);
        checkVictoryDiagonal(rowIndex, colIndex);
    }

    function checkVictoryDiagonal(rowIndex, colIndex) {
        // Check 4 directions and 2 betweens: top left, top right, bottom right, bottom left, between left, and between right
        var board = vm.board;
        var cellSign = board[rowIndex][colIndex];
        var victoryPattern = "";
        var topLeftPattern = "", 
            topRightPattern = "", 
            bottomRightPattern = "", 
            bottomLeftPattern = "", 
            betweenLeftPattern = "", 
            betweenRightPattern = "";
        var initIndexList = [];
        var topLeftIndexList = [],
            topRightIndexList = [],
            bottomRightIndexList = [],
            bottomLeftIndexList = [],
            betweenLeftIndexList = [],
            betweenRightIndexList = [];
        var i = 0;
        while(i < vm.wonNumber){
            victoryPattern += cellSign;
            if(board[rowIndex - i]) {
                topLeftPattern += board[rowIndex - i][colIndex - i];
                topRightPattern += board[rowIndex - i][colIndex + i];               
            } else {
                topLeftPattern += String(board[rowIndex - i]);
                topRightPattern += String(board[rowIndex - i]);
            }
            topLeftIndexList.push([rowIndex - i, colIndex - i]);
            topRightIndexList.push(board[rowIndex - i, colIndex + i]);

            if(board[rowIndex + i]) {
                bottomLeftPattern += board[rowIndex + i][colIndex - i];
                bottomRightPattern += board[rowIndex + i][colIndex + i];               
            } else {
                bottomLeftPattern += String(board[rowIndex + i]);
                bottomRightPattern += String(board[rowIndex + i]);
            }
            bottomLeftIndexList.push([rowIndex + i, colIndex - i]);
            bottomRightIndexList.push(board[rowIndex + i, colIndex + i]);
            i++;
        }
        var j = 0;
        while (j <= ((vm.wonNumber - 1) % 2)) {
            var topLeft = "", topRight = "", bottomRight = "", bottomLeft = "";
            if (board[rowIndex + j]) {
                bottomRight = board[rowIndex + j][colIndex + j];
                bottomLeft = board[rowIndex + j][colIndex - j];
            }
            if(board[rowIndex - j]) {
                topLeft = board[rowIndex - j][colIndex - j];
                topRight = board[rowIndex - j][colIndex + j];
            }
            betweenLeftPattern = topLeft + betweenLeftPattern + bottomRight;
            betweenRightPattern = topRight + betweenRightPattern + bottomLeft;
            betweenLeftIndexList.push([rowIndex - j,colIndex - j]);
            betweenLeftIndexList.push([rowIndex + j,colIndex + j]);
            betweenRightIndexList.push([rowIndex - j,colIndex + j]);
            betweenRightIndexList.push([rowIndex + j,colIndex - j]);
            j++;
        }
        if (betweenLeftPattern === victoryPattern) {
            vm.found = betweenLeftIndexList;
            vm.victorySign = true;
        }
        else if (betweenRightPattern === victoryPattern) {
            vm.found = betweenRightIndexList;
            vm.victorySign = true;
        }
        else if (topLeftPattern === victoryPattern) {
            vm.found = topLeftIndexList;
            vm.victorySign = true;
        }
        else if (topRightPattern === victoryPattern) {
            vm.found = topRightIndexList;
            vm.victorySign = true;
        }
        else if (bottomLeftPattern === victoryPattern) {
            vm.found = bottomLeftIndexList;
            vm.victorySign = true;
        }
        else if (bottomRightPattern === victoryPattern) {
            vm.found = bottomRightIndexList;
            vm.victorySign = true;
        }
        else {
            return false;
        }
    };


    function checkVictoryRow(rowIndex, colIndex) {
        // We keep rowIndex, go through colIndex
        var board = vm.board;
        var cellSign = board[rowIndex][colIndex];
        var victoryPattern = "";
        var i = 0;
        var leftCellPattern = "";
        var leftIndexList = [], rightIndexList = [], betweenIndexList = [];
        var rightCellPattern = "";
        var betweenPattern = cellSign;
       
        while(i < vm.wonNumber){
            victoryPattern += cellSign;
            leftCellPattern += String(board[rowIndex][colIndex - i]);
            rightCellPattern += String(board[rowIndex][colIndex + i]);
            leftIndexList.push([rowIndex, colIndex - i]);
            rightIndexList.push([rowIndex, colIndex + i]);
            i++;
        }
        var j = 1;
        while(j <= ((vm.wonNumber - 1) % 2) ) {
            var left = "", right = "";
            left = board[rowIndex][colIndex + j];
            right = board[rowIndex][colIndex - j];
            betweenPattern = left + betweenPattern + right;
            betweenIndexList.push([rowIndexj,colIndex + j]);
            betweenIndexList.push([rowIndex,colIndex - j]);
            j++;
        }
        if (leftCellPattern === victoryPattern) {
            vm.found = leftIndexList;
            vm.victorySign = true;
        }
        else if (betweenPattern === victoryPattern) {
            vm.found = betweenIndexList;
            vm.victorySign = true;
        }
        else if (rightCellPattern === victoryPattern) {
            vm.found = rightIndexList;
            vm.victorySign = true;
        }
        else {
            return false;
        }
    };

    function handleCellClick(rowIndex,colIndex) {
        if(vm.runningGame && vm.board[rowIndex][colIndex] === "") {
            vm.board[rowIndex][colIndex] = vm.currentSign;
            var log = vm.currentSign + " play at " + String(rowIndex + 1) + ":" + String(colIndex + 1);
            logInfo(log);
            vm.currentRowIndex = rowIndex;
            vm.currentColIndex = colIndex;
            vm.emptyCell -= 1;
            checkVictoryCondition(rowIndex,colIndex);
            if (vm.victorySign) {
                highlightVictoryLine();
            }            
            changePlayer();
            checkStopCondition();
        }
    };

    function highlightVictoryLine() {
        console.log(vm.found);
        var log = JSON.stringify(vm.found);
        logInfo(log);
    }
    function logInfo(log) {       
        vm.logs.push(log);
    }

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

    function makeColIndexArray() {
        for(var i = 1; i <= vm.boardSize; i++){
            vm.colIndexArray.push(i);
        }       
    }

    function resetGame() {
        vm.board = makeBoard(vm.boardSize);
        vm.runningGame = true;
        vm.logs = [];
        vm.found = [];
        vm.emptyCell = (vm.boardSize*vm.boardSize); // Store available cell to play, stop game when don't have any space left
        vm.currentRowIndex = -1;
        vm.currentColIndex = -1;
    }

    vm.board = makeBoard(vm.boardSize);
    makeColIndexArray();
    
    });
}).call(this);
