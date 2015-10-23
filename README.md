# JavaScriptPrac
Practicing Javascript

#NQueenSolver                                                                                                                      
1. Takes N value as input from user.                  
2. Displays number of valid positions of placing queens in an NxN chessboard.           
3. Valid positions are stored in "queenPositions".
4. loaderFunction contains the main functionality of the program.It executes                                
   when all the elements of the HTML page is loaded.
5. createKey takes an integer and an array of integers and creates a unique
   by concatenating the elements provided.Returns this string.
6. isValidPosition position takes a current position ( via curX , curY ) and a
   list of previous positions as an array of integers.It calculates if the
   current position is valid for placing a queen.All previous positions consists of
   ( i , previousPositions[i] ) pair.
7. generatePositions is a recursive function that takes an integer ( current row )
   and a list of all previous positions.Its depth is N.At each step, the function
   iterates through all the valid column positions for current row,saves it and
   calls itself for next row.  
