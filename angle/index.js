$(document).ready(function(){

    canvas = document.getElementById("test-canvas");
    var ctx = canvas.getContext("2d");

    var lineBorder = 10;
    var width = 400, height = 400;
    var lineWidth = 20;
    var lineSpacing = 5;
    var maxBoxHeight = height - (lineBorder+lineSpacing)*2;
    var boxSize = width - lineBorder*2
    var arcRadius = boxSize * 0.4
  
    var tapLocationRadius = 10

    var hasAttempt = false
    var targetColor = "rgb(180,140,220)"
    var tapX = null
    var tapY = null



  // as the user clicks, we will add to this list
    var clickDurations = [];
    var maxIntervals = 31;

    // first draw a box around it
    function drawBorder() {
      ctx.beginPath();
      ctx.moveTo(lineBorder, lineBorder);
      ctx.lineTo(width-lineBorder, lineBorder);
      ctx.lineTo(width-lineBorder, height-lineBorder);
      ctx.lineTo(lineBorder, height-lineBorder);
      ctx.closePath();
      ctx.strokeStyle = "black"
      ctx.stroke();
    }


    function drawPrompt(rotateAngle) {
      // rotate the canvas

      var radiusEndX =  width/2 + arcRadius * Math.cos(rotateAngle);
      var radiusEndY =  height/2 + arcRadius * Math.sin(rotateAngle);

      // draw the midpoint
      ctx.beginPath();
      // get to the middle
      ctx.moveTo(width/2, height/2);
      // draw the radius
      ctx.lineTo(radiusEndX, radiusEndY);
      ctx.closePath();
      ctx.strokeStyle = "black"
      ctx.stroke();

      //  now draw the start of an arc heading outwards,
      // showing where to place the guess
      //
      ctx.save()
      ctx.beginPath();
      ctx.setLineDash([4, 3]);
      // javascript uses this angle notion that goes clockwise
      ctx.arc(width/2, height/2, arcRadius, rotateAngle, rotateAngle + Math.PI/4)
      ctx.strokeStyle = targetColor
      ctx.stroke();
      ctx.restore()
    };

    function scoreAttempt(x, y){
      // draw the attempt
      // compute the score as well
      ctx.beginPath();
      ctx.strokeStyle = "black"
      ctx.arc(x, y, tapLocationRadius, 0, Math.PI*2)
      ctx.stroke();

      // now draw where it was supposed to go
      ctx.beginPath();
      ctx.strokeStyle = "rgb(140,197,220)"
      ctx.arc(targetX, targetY, tapLocationRadius, 0, Math.PI*2)
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width/2, height/2, arcRadius, rotateAngle, rotateAngle + Math.PI/2)
      ctx.stroke();
    }

    function clearBox() {
      ctx.fillStyle = 'rgba(255,255,255,1.0)';
      ctx.fillRect(0,0,width,height);
    }

    var rotateAngle, targetX, targetY = 0

      

    function setupNewGame() {
      // figure out what the target position is
      rotateAngle = Math.PI*2*Math.random();
      targetX = width/2 + arcRadius * Math.cos(Math.PI/2+rotateAngle)
      targetY = height/2 + arcRadius * Math.sin(Math.PI/2+rotateAngle)


      clearBox();
      drawPrompt(rotateAngle)
      drawBorder();
    }

    setupNewGame();

  $("#test-canvas").on('click tap', function(event) {
    if (hasAttempt) {
      setupNewGame()
      hasAttempt = false;
    } else {
      console.log(event)
      let rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      $("#this-round-results").html(
          "X: "+x + "vs " + targetX + "\nY: "+y + " vs " +targetY
      )
      hasAttempt = true
      scoreAttempt(x, y)
    }
  })
  

});
