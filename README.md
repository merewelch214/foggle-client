#  Foggle Front End
This repo houses the front end for an application called Foggle. 

# Introduction
Foggle was built to mimic the game Boggle. 
In Foggle, the user is presented with a board of 4 x 4 letters. The aim of the game is to make as many words in the allotted time as possible. Points are calculated based on the number of real words a user has entered. All submitted words must be at least 3 letters long and must be unique. You cannot play the same word multiple times. Any letter may be selected to start the word. After the first letter
is selected, the user may only play letters that are to the side, above, below or diagonal from the first letter. In other words, each letter must touch another in order to be 'in-play'. At the end of the game, the user's scoure is added to the leaderboard.

# Technologies 
Foggle was built as a single page application using Vanilla Javascript along with a Rails API.

# Launch
In order to launch Foggle, you should first spin up a server from the Foggle Server repo. Once you have a server running, simply type 'open index.html' in the terminal. You must be in the foggle-client folder in order for this to work. 


