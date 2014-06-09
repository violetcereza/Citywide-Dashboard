$.get('dashboard.svg', function(data, textStatus, jqXHR) {
  var draw = SVG('svg-container');
  draw.svg(jqXHR.responseText);
  draw = SVG.get('drawing');
  $("#drawing").attr("width", "100%").attr("height", "100%");
  
  /*************************
  ** Continual animations **
  *************************/
  
  SVG.get("ship").animate(40000, '-').dmove(1350, -50).loop();
  SVG.get("blades").transform({cx: 19, cy: 25}).animate(2000, '-').transform({rotation: 360}).loop();
  
  var pipes = $("#svg-container #pipes > image");
  var smoke = SVG.get('smoke');
  var pipesOut = function() {
    pipes.each(function() {
      this.instance.load("img/smokestack/smokestack1.png");
    });
    
    smoke.animate(1000, ">").scale(2,2).dmove(0,-300).attr('opacity', 0).after(function() {
      this.attr('opacity', 1).translate(0,0).scale(1);
    });
    
    window.setTimeout(pipesIn, 1000);
  }
  var pipesIn = function() {
    pipes.each(function() {
      this.instance.load("img/smokestack/smokestack2.png");
    });
    window.setTimeout(pipesOut, 1000);
  }
  pipesIn();
  
  var squirrel = SVG.get("squirrel");
  squirrel.each(function() {
    this.hide();
  });
  var squirrelFrame = squirrel.first().show();
  
  var fish = SVG.get("fish");
  fish.each(function() {
    this.hide();
  });
  var fishFrame = fish.first().show();
  
  window.setInterval(function() {
    squirrelFrame = squirrelFrame.hide().next();
    if (!squirrelFrame) squirrelFrame = squirrel.first();
    squirrelFrame.show();
    
    fishFrame = fishFrame.hide().next();
    if (!fishFrame) fishFrame = fish.first();
    fishFrame.show();
  }, 1000/24);
  // 24fps
  
  /***************************
  ** State-based animations **
  ***************************/
  
  var text = draw.text("Welcome to Oberlin's Bioregional Dashboard!\nClick on the icons above to learn more out the existing environmental conditions at Oberlin.")
  text.move(210, 80).font({ family: 'Futura-Medium', size: 21 }).fill("#777");
  var intervalObjs = [];
  var state = StateMachine.create({
    initial: 'none',
    events: [
      { name: 'toElectricity', from: '*', to: 'electricity' },
      { name: 'toWater', from: '*', to: 'water' },
      { name: 'toStream', from: '*', to: 'stream' },
      { name: 'toWeather', from: '*', to: 'weather' }],
    callbacks: {
      onelectricity:  function() {
        SVG.get('powerlines').load("img/powerlines_lit.png");
        squirrel.attr("display", null);
        text.text("Welcome to the Bioregional Dashboard’s electricity use page! Here you can click on\ngauges and icons and learn more about energy in our community.")
    
        var startTime = new Date();
        var duration = 2;
        $("#sparkpaths > path").each(function() {
          var path = this;
          var spark = draw.circle(15).move(-15,-15).fill(draw.gradient('radial', function(stop) {
            stop.at(0, "#FDF502")
            stop.at(1, '#FDCC02')
          })).attr("class", "spark");
          var len = path.getTotalLength();
      
          intervalObjs.push(window.setInterval(function() {
            var now = new Date(),
		            elapsed = (now-startTime)/1000,
                pos;
            
            if (elapsed > duration) {
              startTime = now;
              pos = 0;
            } else {
              pos = (elapsed/duration);
            }
            
            // https://gist.github.com/gre/1650294 Ease Out Quad
            pos = pos*(2-pos);
            
            var coord = path.getPointAtLength(len*pos);
            spark.center(coord.x, coord.y);
          }, 10));
        });                
      },
      onleaveelectricity:  function() {
        SVG.get('powerlines').load("img/powerlines.png");
        squirrel.attr("display", "none");
        $(".spark").each(function() { this.instance.remove(); });
      },
      onwater: function() {
        var clip = draw.clip();
        SVG.get('freshwater_highlighted').attr("display", null);
        SVG.get('wastewater_highlighted').attr("display", null);
        fish.attr("display", null);        
        SVG.get("waterlines_clip").attr("display", null).clipWith(clip);
        text.text("Welcome to the Bioregional Dashboard’s water page! Here you can click on\ngauges and icons and learn more about water in our community.")
        
        var startTime = new Date();
        var duration = 4;
        $("#dropletpaths > path").each(function() {
          var path = this;
          var droplet = draw.circle(50).attr("class", "droplet");
          var len = path.getTotalLength();
          
          clip.add(droplet);
          
          intervalObjs.push(window.setInterval(function() {
            var now = new Date(),
                elapsed = (now-startTime)/1000,
                pos;
            
            if (elapsed > duration) {
              startTime = now;
              pos = 0;
            } else {
              pos = (elapsed/duration);
            }
            var coord = path.getPointAtLength(len*pos);
            droplet.center(coord.x, coord.y);
          }, 10));
        });                
      },
      onleavewater: function() {
        SVG.get('freshwater_highlighted').attr("display", "none");
        SVG.get('wastewater_highlighted').attr("display", "none");
        SVG.get("waterlines_clip").attr("display", "none");
        fish.attr("display", "none");
        $(".droplet").each(function() { this.instance.remove(); });
      },
      onstream: function() {
        var clip = draw.clip();
        SVG.get("flow_marks").attr("display", null).clipWith(clip);
        fish.attr("display", null);
        text.text("This view of the dashboard shows community-wide conditions of Plum Creek. \nAll water falling on Oberlin drains eventually flows down Plum Creek.")
        
        var startTime = new Date();
        var duration = 2;
        $("#flowpath").each(function() {
          var path = this;
          var droplet = draw.circle(100).attr("class", "flowshine");
          var len = path.getTotalLength();
          
          clip.add(droplet);
          
          intervalObjs.push(window.setInterval(function() {
            var now = new Date(),
                elapsed = (now-startTime)/1000,
                pos;
            
            if (elapsed > duration) {
              startTime = now;
              pos = 0;
            } else {
              pos = (elapsed/duration);
            }
            var coord = path.getPointAtLength(len*pos);
            droplet.center(coord.x, coord.y);
          }, 10));
        });                
      },
      onleavestream: function() {
        SVG.get('flow_marks').attr("display", "none");
        SVG.get('fish').attr("display", "none");
        $(".flowshine").each(function() { this.instance.remove(); });
      },
      onweather: function() {
        SVG.get("sunset").attr("display", null);
        squirrel.attr("display", null);
        text.text("Welcome to the Bioregional Dashboard’s weather page! \nLearn about Oberlin's climate and weather.")
      },
      onleaveweather: function() {
        SVG.get('sunset').attr("display", "none");
        squirrel.attr("display", "none");
      },
      onleavenone: function() {
        squirrel.attr("display", "none");
      },
      onleavestate: function() {
        for (var i = intervalObjs.length - 1; i >= 0; i--) {
          window.clearInterval(intervalObjs[i]);
        }
        intervalObjs = [];
      }
    }
  });
  
  /***********************
  ** Button Interaction **
  ***********************/
  
  // Blech. Keeps images aligned when they change size
  var buttonCoords = {
    "electricity": {x: 53-68, y: 12-36},
    "water": {x: 79-79, y: 15-41},
    "stream": {x: 76-85, y: 14-37},
    "weather": {x: 70-70, y: 12-38}
  }
  $("#buttons > image").each(function() {
    this.instance.mouseover(function() {
      if (!state.is(this.attr("id"))) {
        this.load("img/"+this.attr("id")+"_button_hover.png");
      }
    });
    this.instance.mouseout(function() {
      if (!state.is(this.attr("id"))) {
        this.load("img/"+this.attr("id")+"_button.png");
      }
    });
    this.instance.click(function() {
      if (this.attr("id") == state.current) { return; }
      
      $("#buttons > .selected").each(function() {
        that = this.instance;
        that.attr('class', null);
        that.load("img/"+that.attr("id")+"_button.png").loaded(function(loader) {
          this.size(loader.width, loader.height);
          var coords = buttonCoords[this.attr("id")];
          this.dmove(-coords.x, -coords.y);
          this.loaded(null);
        });
      });
      
      this.attr('class', 'selected');
      this.load("img/"+this.attr("id")+"_button_highlighted.png").loaded(function(loader) {
        this.size(loader.width, loader.height);
        var coords = buttonCoords[this.attr("id")];
        this.dmove(coords.x, coords.y);
        this.loaded(null);
      });
      
      switch (this.attr("id")) {
        case "electricity":
          state.toElectricity();
          break;
        case "water":
          state.toWater();
          break;
        case "stream":
          state.toStream();
          break;
        case "weather":
          state.toWeather();
          break;
      }
    });
  });
  
  var hoverFilter;
  $("#clickables > *").each(function() {
    that = this.instance;
    
    that.mouseover(function() {
      if (!hoverFilter) {
        this.filter(function(add) {
          var blur = add.offset(10, 10).in(add.sourceAlpha).gaussianBlur(5).colorMatrix('matrix', [2, , 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
          add.blend(add.source, blur);
          this.size('200%','200%').move('-50%', '-50%');
        });
        hoverFilter = this.filterer;
      } else {
        this.filter(hoverFilter);
      }
    });
  
    that.mouseout(function() {
      this.unfilter();
    });
    
  });
});
