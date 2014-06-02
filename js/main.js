$(function() {
  $("svg image").each(function() {
    var image = $(this);
    if (!image.attr("width") && !image.attr("height")) {
      // http://stackoverflow.com/questions/318630/get-real-image-width-and-height-with-javascript-in-safari-chrome
      $("<img/>") // Make in memory copy of image to avoid css issues
          .attr("src", image.attr("xlink:href"))
          .load(function() {
              image.attr("width", this.width);   // Note: $(this).width() will not
              image.attr("height", this.height); // work for in memory images.
          });
    }    
  })
  
  // http://stackoverflow.com/questions/1108480/svg-draggable-using-jquery-and-jquery-svg
  // $("svg image, svg rect").draggable().bind('mousedown', function(event, ui){
  //   // bring target to front
  //   //$(event.target.parentElement).append( event.target );
  // }).bind('drag', function(event, ui){
  //   // update coordinates manually, since top/left style props don't work on SVG
  //   event.target.setAttribute('x', ui.position.left);
  //   event.target.setAttribute('y', ui.position.top-$(document.body).scrollTop());
  // });
});
