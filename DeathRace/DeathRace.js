(function (wisp) {
    'use strict';

    var obstaclesOnScreen = [];

    var gameStartTime;
    var timeToSpeedUp = 15000;
		var nextLevelTime = 1.5;
		var linearSpeed = 100;
		var gameFinished = false;
		var gameEndTime = 30000;
    var speeding = false;

		var canvas = document.getElementById("myCanvas");
		var context = canvas.getContext('2d');

    var videoCanvas = document.getElementById("videoCanvas");
    var videoContext = videoCanvas.getContext("2d");
    var video = document.createElement("video");

    var leftMovement = "left", rightMovement = "right";

    var detector;
    var oldPos;

    var player;

    var explosion = new Image();
    var tankImage = new Image();
    var truckImage = new Image();
    var winImage = new Image();

    var loadImages = function ( ){
      explosion.src = "image/explosion.png";
      tankImage.src = "image/tank.png";
      truckImage.src = "image/truck_small.png";
      winImage.src = "image/youwin.jpg";
    }

    var imagesReady = function ( ){
      return explosion.complete && tankImage.complete && truckImage.complete && winImage.complete;
    }

    var videoReady = function ( ) {
      return video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0;
    }

    var addKeyListener = function ( ) {
      window.addEventListener("keydown", function(e){
  			if ( e.keyCode === 37){
  				BaseOperations.moveLeft( player , context , gameFinished );
  			}
  			else if( e.keyCode === 39){
  				BaseOperations.moveRight( player , context , gameFinished );
  			}
        else if ( e.keyCode === 38 ){
          BaseOperations.moveUp( player , context , gameFinished );
        }
        else if ( e.keyCode === 40 ){
          BaseOperations.moveDown( player , context , gameFinished );
        }

			}, true);
    }

    wisp.gameStatus = function ( ){
      return gameFinished;
    }

     var Obstacle = function ( x , y , width , height , image ){
       this.x = x;
       this.y = y;
       this.width = width;
       this.height = height;
       this.image = image;
     }

     var startGame = function () {


       var obstacleLooper = setInterval(function() {
         if ( !imagesReady() || !videoReady() ) return ;
         var curTime = (new Date()).getTime();
         if ( !gameStartTime ) {
           gameStartTime = curTime;
           player = new Obstacle( 135 , 600 , 33 , 100 , truckImage );
           BaseOperations.drawObject ( player , context );
           addKeyListener( );
         }
         if ( BaseOperations.canAddObstacle( obstaclesOnScreen ) && BaseOperations.getRandomNumber( ) < 20 ) {

           var randomValue = BaseOperations.getRandomNumber( );
           var curObstacle = new Obstacle (  30 , 0 , 41 , 100 , tankImage );
           obstaclesOnScreen.push ( curObstacle );
           if ( randomValue > 33 ) curObstacle.x += 100;
           if ( randomValue > 66 ) curObstacle.x += 100;

           BaseOperations.animate ( curObstacle , curTime , linearSpeed , obstaclesOnScreen , gameFinished );
       }

      }, 1000/10);

      var videoLooper = setInterval ( function ( ){
        if (video.paused) video.play();
        // console.log ( video );
        if ( !imagesReady() || !videoReady() ) return ;
        else {
          videoCanvas.width = ~~(100 * video.videoWidth / video.videoHeight);
          videoCanvas.height = 100;
          videoContext.drawImage(video, 0, 0, videoCanvas.clientWidth, videoCanvas.clientHeight);

          var moveDirection = BaseOperations.getMovement( video , detector , videoCanvas );
          console.log ( moveDirection );
          if ( moveDirection == "left" ) BaseOperations.moveLeft( player , context , gameFinished );
          else if ( moveDirection == "right" ) BaseOperations.moveRight ( player , context , gameFinished );
          else if ( moveDirection == "up" ) BaseOperations.moveUp ( player , context , gameFinished );
          else if ( moveDirection == "down" ) BaseOperations.moveDown ( player , context , gameFinished );;
        }
      } , 1000/10);

      var speedLooper = setInterval(function(){
        if ( !imagesReady() || !videoReady() ) return ;
				if( !speeding && gameStartTime && (new Date()).getTime() - gameStartTime >= timeToSpeedUp){
          gameStartTime = (new Date()).getTime();
          speeding = true;
          // console.log ("in");
				}
        else if ( speeding ){
          if ( (new Date()).getTime() - gameStartTime >= nextLevelTime ) linearSpeed *= 1.000025;
        }

        if (gameStartTime && (new Date()).getTime() - gameStartTime >= gameEndTime) {
					gameFinished = true;
					linearSpeed = 0;
          console.log ("you Won");

          context.clearRect(0,0, 300, 700);
					context.drawImage(winImage, 0, 150);

          clearInterval ( obstacleLooper );
					clearInterval ( speedLooper );
					clearInterval ( eventCheckLooper );
          clearInterval ( videoLooper );
				}
			},1000);

      var eventCheckLooper = setInterval( function ( ){
        if ( !imagesReady() || !videoReady() ) return ;
				if ( BaseOperations.checkCollisions ( player , obstaclesOnScreen ) ){

					gameFinished = true;
					linearSpeed = 0;

					BaseOperations.removeObject(player,context);
					context.drawImage(explosion, player.x - 32, player.y);

          console.log ( "you lost" );

					clearInterval ( obstacleLooper );
					clearInterval ( speedLooper );
					clearInterval ( eventCheckLooper );
          clearInterval ( videoLooper );
				}
			} , 1000/10 );

   }

    /**
     * Constructs Scrachable Object
     * @param {!Object} settings The settings object for the module which contains necessary values for the ad to run.
     */
    var DeathRace = function (settings) {
        /**
         * Random id for the module instance, could also be an incremented id if you are less lazy
         * @type {string}
         */
        this.id = String(Math.floor(Math.random() * 1000000000)).substring(2, 11);
        /**
         * The id of the html element that should be used as a container
         * @type {string}
         */
        this.containerElementId = null;

        BaseOperations.getVideoStream ( video );
        loadImages();
        startGame();
    };

    /**
     * Public constructor
     * @param {!Object} settings The object which contains the necessary value for the ad to run.
     * @returns {Object}
     * @constructor
     */
    wisp.DeathRace = function (settings) {
      // BaseOperations.getVideoStream();
      return new DeathRace(settings);
    };
    /**
     * Public method to be called to prepare the ad
     */
    DeathRace.prototype.anyPublicMethodToCall = function () {

    };

}(window.wisp = window.wisp || {}));
