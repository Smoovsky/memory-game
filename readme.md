# Overview
A memory game built with jQuery

# Updates since last submission
* The game now should be responsive, should be able to fit across a wide range of devices. However, the game won't rescale dynamically if a viewport changes its size in-game. It will only rescale at the beginning of the next round.

* Players now have a restart button to allow them to restart game anytime.

* Players now also get a timer to let them know that how much time they consumed.

* Players know how much moves they have performed now.

* The score of game is now represented in term of number of stars(out of three stars).

* A proper finish screen tells players how many stars they have obtained and how long they have taken to clear the game, there is also a button to let player go straight to another round.

* Bug fix.

* A little bit more styling to make the UI looks a little bit better.

# Install dependencies
* `npm install`

# build and run
* run: `npm start`
- The dev-server will then run on localhost:7700


* build: `npm run build`
- build is not functional properly yet, need to manually insert script tag for bundle.js in index.html.
