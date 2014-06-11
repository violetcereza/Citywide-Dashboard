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
    this.attr("display","none");
  });
  var squirrelFrame = squirrel.first().attr("display", null);
  
  var fish = SVG.get("fish");
  fish.each(function() {
    this.attr("display","none");
  });
  var fishFrame = fish.first().attr("display", null);
  
  window.setInterval(function() {
    squirrelFrame = squirrelFrame.attr("display","none").next();
    if (!squirrelFrame) squirrelFrame = squirrel.first();
    squirrelFrame.attr("display", null);
    
    fishFrame = fishFrame.attr("display","none").next();
    if (!fishFrame) fishFrame = fish.first();
    fishFrame.attr("display", null);
  }, 1000/24);
  // 24fps
  
  /***************************
  ** State-based animations **
  ***************************/
  
  var text = draw.text("Welcome to Oberlin's Bioregional Dashboard!\nClick on the icons above to learn more out the existing environmental conditions at Oberlin.")
  text.move(210, 80).font({ family: 'Futura-Medium', size: 21 }).fill("#777");
  var intervalObjs = [];
  var state = StateMachine.create({
    initial: window.location.hash? window.location.hash.substr(1) : 'none',
    events: [
      { name: 'toElectricity', from: '*', to: 'electricity' },
      { name: 'toWater', from: '*', to: 'water' },
      { name: 'toStream', from: '*', to: 'stream' },
      { name: 'toWeather', from: '*', to: 'weather' }],
    callbacks: {
      onelectricity:  function() {
        SVG.get('powerlines_lit').attr("display", null)
        squirrel.attr("display", null)
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
        SVG.get('powerlines_lit').attr("display","none")
        squirrel.attr("display","none")
        $(".spark").each(function() { this.instance.remove(); });
      },
      onwater: function() {
        var clip = draw.clip();
        SVG.get('freshwater_highlighted').attr("display", null)
        SVG.get('wastewater_highlighted').attr("display", null)
        fish.attr("display", null)        
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
        SVG.get('freshwater_highlighted').attr("display","none")
        SVG.get('wastewater_highlighted').attr("display","none")
        SVG.get("waterlines_clip").attr("display","none")
        fish.attr("display","none")
        $(".droplet").each(function() { this.instance.remove(); });
      },
      onstream: function() {
        var clip = draw.clip();
        SVG.get("flow_marks").attr("display", null).clipWith(clip);
        fish.attr("display", null)
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
        SVG.get('flow_marks').attr("display","none")
        SVG.get('fish').attr("display","none")
        $(".flowshine").each(function() { this.instance.remove(); });
      },
      onweather: function() {
        SVG.get("sunset").attr("display", null)
        squirrel.attr("display", null)
        text.text("Welcome to the Bioregional Dashboard’s weather page! \nLearn about Oberlin's climate and weather.")
      },
      onleaveweather: function() {
        SVG.get('sunset').attr("display","none")
        squirrel.attr("display","none")
      },
      onleavenone: function() {
        squirrel.attr("display","none")
      },
      onstate: function(event, from, to) {
        window.location.hash = to;
        
        // Blech. Keeps images aligned when they change size
        // var buttonCoords = {
        //   "electricity": {x: 53-68, y: 12-36},
        //   "water": {x: 79-79, y: 15-41},
        //   "stream": {x: 76-85, y: 14-37},
        //   "weather": {x: 70-70, y: 12-38}
        // }
        // $("#buttons > .selected").each(function() {
        //   button = this.instance;
        //   button.attr('class', null);
        //   button.load("img/"+button.attr("id")+"_button.png").loaded(function(loader) {
        //     this.size(loader.width, loader.height);
        //     var coords = buttonCoords[this.attr("id")];
        //     this.dmove(-coords.x, -coords.y);
        //     this.loaded(null);
        //   });
        // });
      
        SVG.get(to).attr("display","none");
        SVG.get(to+"_hover").attr("display","none");
        SVG.get(to+"_highlight").attr("display", null);
        // button.attr('class', 'selected');
        // button.load("img/"+button.attr("id")+"_button_highlighted.png").loaded(function(loader) {
        //   console.log(loader);
        //   this.size(loader.width, loader.height);
        //   var coords = buttonCoords[this.attr("id")];
        //   this.dmove(coords.x, coords.y);
        //   this.loaded(null);
        // });
      },
      onleavestate: function(event, from, to) {
        for (var i = intervalObjs.length - 1; i >= 0; i--) {
          window.clearInterval(intervalObjs[i]);
        }
        intervalObjs = [];
        
        if (SVG.get(from)) {
          SVG.get(from).attr("display", null);
          SVG.get(from+"_hover").attr("display", "none");
          SVG.get(from+"_highlight").attr("display", "none");
        }
      }
    }
  });
  
  /***********************
  ** Button Interaction **
  ***********************/
  
  $("#buttons > image").each(function() {
    var thisState = this.instance.attr("id").split("_")[0]; // electricity, water, etc
    var thisType = this.instance.attr("id").split("_")[1]; // hover, "", highlight
    
    this.instance.mouseover(function() {
      if (!state.is(thisState) && thisType!="hover") {
        this.attr("display","none");
        SVG.get(thisState+"_hover").attr("display", null);
      }
    });
    this.instance.mouseout(function() {
      if (!state.is(thisState) && thisType=="hover") {
        this.attr("display","none");
        SVG.get(thisState).attr("display", null);
      }
    });
    this.instance.click(function() {
      if (thisState == state.current) { return; }
            
      switch (thisState) {
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
  var descriptions = {
    park: {
      text: "Whether you enjoy the many cultural or musical events, or just lying in the grass under trees with friends, this 13-acre square connects Oberlin residents to each other and our environment.",
      title: "Town Square",
      link: "http://oberlindashboard.org/wiki.php#1j"
    },
    town: {
      text: "The City of Oberlin and Oberlin College were founded in 1833. Oberlin is building on its legacy as a leader on issues of civil rights and justice through commitments to environmental sustainability.",
      title: "The Town of Oberlin",
      link: "http://oberlindashboard.org/wiki.php#1h"
    },
    college: {
      text: "Oberlin College was the first institution in the US to admit african americans, the first to admit women and is working closely with the city to build an ecologically, socially and economically sustainable model of a post-fossil fuel community.",
      title: "Oberlin College",
      link: "http://oberlindashboard.org/wiki.php#1i"
    },
    houses: {
      text: "The decisions each of us make every day in our homes, schools and workplaces directly affect our community and the environment. We are all connected by these choices.",
      title: "Your Home",
      link: "http://oberlindashboard.org/wiki.php#1k"
    },
    water_treatment: {
      text: "Dirty water from homes and businesses flows through underground pipes to Oberlin’s wastewater treatment plant where it is cleaned and released into the Plum Creek.",
      title: "Wastewater Treatment Plant",
      link: "http://oberlindashboard.org/wiki.php#1d"
    },
    agriculture: {
      text: "Although farmland is rapidly turning into houses, agriculture is still the largest industry in Lorain County. While corn and soybeans cover the largest area, local fruits and vegetables are easily available and very tasty.",
      title: "Agriculture",
      link: "http://oberlindashboard.org/wiki.php#1f"
    },
    water_tower: {
      text: "The water you use in Oberlin is collected from the West branch of the Black River, into a reservoir. It is then filtered, pumped, and stored in water towers until you turn on your tap.",
      title: "Drinking Water",
      link: "http://oberlindashboard.org/wiki.php#1b"
    },
    reservoir: {
      text: "The water you use in Oberlin is collected from the West branch of the Black River, into a reservoir. It is then filtered, pumped, and stored in water towers until you turn on your tap.",
      title: "Drinking Water",
      link: "http://oberlindashboard.org/wiki.php#1b"
    },
    industry: {
      text: "Oberlin Municipal Light and Power (OMLPS) manages the flow of electricity from power generation facilities (using landfill gas, hydroelectric, wind, solar, coal and nuclear) over the electrical “grid” to our homes and workplaces where we use it for lights, computers, toasters and more.",
      title: "Electricity Production",
      link: "http://oberlindashboard.org/wiki.php#1a"
    },
    city: {
      text: "The bigger cities around Oberlin like Elyria, Lorain and Cleveland are part of the “rust belt” -- places where the steel industry has declined and politicians, residents and entrepreneurs are working to build the economy, clean the environment and celebrate culture.",
      title: "Urbanization and Cleveland",
      link: "http://oberlindashboard.org/wiki.php#1g"
    },
    river_click: {
      text: "A watershed is an area of land that drains to a single body of water. Rain and snow that fall on Oberlin drain into the Plum Creek, which then flows into the Black River.",
      title: "Watershed",
      link: "http://oberlindashboard.org/wiki.php#1c"
    }
  };
  $("#clickables > *").each(function() {
    clickable = this.instance;
    
    clickable.mouseover(function() {
      clickable = this;
      if (clickable.attr("id") == "river_click") clickable = SVG.get("river");
      
      if (!hoverFilter) {
        // this.filter(function(add) {
        //   var blur = add.offset(10, 10).in(add.sourceAlpha).gaussianBlur(5).colorMatrix('matrix', [2, , 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
        //   add.blend(add.source, blur);
        //   this.size('200%','200%').move('-50%', '-50%');
        // });
        clickable.filter(function(add) {
          add.componentTransfer({
            rgb: { type: 'linear', slope: 1, intercept: 0.01 }
          })
        });
        hoverFilter = clickable.filterer;
      } else {
        clickable.filter(hoverFilter);
      }
    });
    
    clickable.mouseout(function() {
      clickable = this;
      if (clickable.attr("id") == "river_click") clickable = SVG.get("river");
      
      clickable.unfilter();
    });
    
    clickable.click(function(e) {
      var dscr = descriptions[this.attr('id')];
      // draw.parent.rect(200, 100).radius(10).fill("white").stroke({color: "#555", width: 2}).move(e.x, e.y);
      // draw.parent.text(description.text).move(e.x+10, e.y+10);
      $(".popup").remove();
      var popup = $('<div class="popup"><span class="close">X</span><h1>'+dscr.title+'</h1><p>'+dscr.text+' <a href="'+dscr.link+'">Read more</a></p></div>');
      popup.find(".close").click(function() { popup.remove() });
      popup.appendTo(document.body).offset({top: e.y, left: e.x});
    });
  });
});
