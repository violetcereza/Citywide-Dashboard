// Because Illustrator modifies attr and not style, so showing does work unless we do too
SVG.extend(SVG.Element, {
  hide: function() {
    return this.attr('display', 'none')
  },
  show: function() {
    return this.attr('display', '')
  }
});

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
  
  // http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
  function htmlEncode( html ) {
      return document.createElement( 'a' ).appendChild( 
          document.createTextNode( html ) ).parentNode.innerHTML;
  }
  
  var fObj = draw.foreignObject(1000, 100).move(200, 80);
  fObj.appendChild("div", { innerText: "Welcome to Oberlin's Bioregional Dashboard! Click on the icons above to learn more out the environmental conditions at Oberlin."});
  var text = $(fObj.getChild(0));
  text.css({ fontFamily: 'Futura-Medium', fontSize: 19, color: "#777" });
  var messageSection;
  function selectMessage(section) {
    var sourceMessages = prefs.messageSections[section].messages;
    
    var selectedMessages = [];
    var selectedWeights = [];
    for (var i = sourceMessages.length - 1; i >= 0; i--) {
      if (sourceMessages[i].state && !state.is(sourceMessages[i].state)) continue;
      if (sourceMessages[i].startDate && sourceMessages[i].endDate) {
        if ( moment().isBefore(moment(sourceMessages[i].startDate, "ddd MMM DD YYYY")) ) continue;
        if ( moment().isAfter(moment(sourceMessages[i].endDate, "ddd MMM DD YYYY")) ) continue;
      }
      
      selectedMessages.push(sourceMessages[i].text);
      if (typeof sourceMessages[i].probability == "number") {
        selectedWeights.push(sourceMessages[i].probability);
      } else {
        // TODO; bins
        var bin = 4;
        selectedWeights.push(sourceMessages[i].probability[bin]);
      }
    }
    // http://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability/
    var getRandomItem = function(list, weight) {
        var total_weight = weight.reduce(function (prev, cur, i, arr) {
            return prev + cur;
        });

        var random_num = Math.random() * total_weight;
        var weight_sum = 0;

        for (var i = 0; i < list.length; i++) {
            weight_sum += weight[i];
            weight_sum = +weight_sum.toFixed(2);
   
            if (random_num <= weight_sum) {
                return list[i];
            }
        }
    };
    text.text(htmlEncode(getRandomItem(selectedMessages, selectedWeights)));
    // Force redraw
    fObj.dmove(1,0);
    fObj.dmove(-1,0);
  }
  
  var gauges = draw.foreignObject(286, 835).move(1278, 75);
  gauges.appendChild("div");
  $(gauges.getChild(0)).append('<iframe frameBorder="0" src="http://localhost:8888/dashboard/grape.html" height="100%" width="100%" marginwidth="0" scrolling="no">We apologize, but it looks like this feature can\'t be displayed in your browser</iframe>');
  
  var intervalObjs = [];
  var state = StateMachine.create({
    events: [
      { name: 'toElectricity', from: '*', to: 'electricity' },
      { name: 'toWater', from: '*', to: 'water' },
      { name: 'toStream', from: '*', to: 'stream' },
      { name: 'toWeather', from: '*', to: 'weather' },
      { name: 'next', from: 'weather', to: 'electricity' },
      { name: 'next', from: 'electricity', to: 'water' },
      { name: 'next', from: 'water', to: 'stream' },
      { name: 'next', from: 'stream', to: 'weather' }],
    callbacks: {
      onelectricity: function() {
        SVG.get('powerlines_lit').show();
        squirrel.show();
    
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
        SVG.get('powerlines_lit').hide()
        squirrel.hide()
        $(".spark").each(function() { this.instance.remove(); });
      },
      onwater: function() {
        var clip = draw.clip();
        SVG.get('freshwater_highlighted').show();
        SVG.get('wastewater_highlighted').show();
        fish.show();        
        SVG.get("waterlines_clip").show().clipWith(clip);
                
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
        SVG.get('freshwater_highlighted').hide()
        SVG.get('wastewater_highlighted').hide()
        SVG.get("waterlines_clip").hide()
        fish.hide()
        $(".droplet").each(function() { this.instance.remove(); });
      },
      onstream: function() {
        var clip = draw.clip();
        SVG.get("flow_marks").show().clipWith(clip);
        fish.show();
        
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
        SVG.get('flow_marks').hide()
        SVG.get('fish').hide()
        $(".flowshine").each(function() { this.instance.remove(); });
      },
      onweather: function() {
        SVG.get("sunset").show();
        squirrel.show();
      },
      onleaveweather: function() {
        SVG.get('sunset').hide()
        squirrel.hide()
      },
      onnone: function() {
        SVG.get('house_inside').hide();
      },
      onleavenone: function() {
        SVG.get('house_inside').show();
        squirrel.hide()
      },
      onstate: function(event, from, to) {
        window.location.hash = to;
        
        // top menu buttons
        SVG.get(to).hide();
        SVG.get(to+"_hover").hide();
        SVG.get(to+"_highlight").show();
        
        // stick figures
        SVG.get('stick_figures').each(function() {
          this.hide();
        });
        if (SVG.get('stick_'+to)) SVG.get('stick_'+to).show();
        
        // message at top
        if (to == "none") {
          selectMessage(0);
        } else {
          messageSection = 0;
          selectMessage(messageSection+1);
          intervalObjs.push(window.setInterval(function() {
            messageSection = (messageSection+1) % (prefs.messageSections.length-1);
            selectMessage(messageSection+1);
          }, prefs.timing.delayBetweenMessages*1000));
        }
      },
      onleavestate: function(event, from, to) {
        for (var i = intervalObjs.length - 1; i >= 0; i--) {
          window.clearInterval(intervalObjs[i]);
        }
        intervalObjs = [];
        
        if (SVG.get(from)) {
          SVG.get(from).show();
          SVG.get(from+"_hover").hide();
          SVG.get(from+"_highlight").hide();
        }
      }
    }
  });
  if (window.location.hash) {
    state[ "to" + window.location.hash.charAt(1).toUpperCase() + window.location.hash.slice(2) ]();
    state[ "to" + window.location.hash.charAt(1).toUpperCase() + window.location.hash.slice(2) ]();
  }
  
  var playIntervalObj;
  var playBarMask = draw.rect(0, 30).move(200, 160).fill('white');
  SVG.get('darkplay').hide().maskWith(playBarMask);
  var playState = StateMachine.create({
    initial: "action",
    events: [
      { name: 'actioned', from: '*', to: 'action' },
      { name: 'toWaiting', from: '*', to: 'waiting' },
      { name: 'toPlaying', from: '*', to: 'playing' },
      { name: 'toggle', from: 'waiting', to: 'playing' },
      { name: 'toggle', from: 'playing', to: 'action' }],
    callbacks: {
      onaction: function() {
        var playState = this;
        playState.toWaiting();
        playIntervalObj = window.setInterval(function() {
          playState.toPlaying();
        }, prefs.timing.delayBeforePlayMode*1000);
      },
      onplaying: function() {
        SVG.get("playtext").hide();
        SVG.get("pausetext").show();
        SVG.get('darkplay').show();
        
        state.next();
        playBarMask.width(0).animate(prefs.timing.delayWhenPlaying*1000, '=').attr({ width: 100 });
        
        playIntervalObj = window.setInterval(function() {
          state.next();
          playBarMask.width(0).animate(prefs.timing.delayWhenPlaying*1000, '=').attr({ width: 100 });
        }, prefs.timing.delayWhenPlaying*1000);
      },
      onleaveplaying: function() {
        SVG.get("playtext").show();
        SVG.get("pausetext").hide();
        SVG.get('darkplay').hide();        
      },
      onleavestate: function(event, from, to) {
        if (playIntervalObj) {
          window.clearInterval(playIntervalObj);
        }
        playIntervalObj = null;
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
      playState.actioned();
      if (!state.is(thisState) && thisType!="hover") {
        this.hide();
        SVG.get(thisState+"_hover").show();
      }
    });
    this.instance.mouseout(function() {
      if (!state.is(thisState) && thisType=="hover") {
        this.hide();
        SVG.get(thisState).show();
      }
    });
    this.instance.click(function() {
      if (thisState == state.current) { return; }
      
      playState.actioned();
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
    
    clickable.node.style.cursor = "pointer";
    
    clickable.mouseover(function() {
      playState.actioned();
      clickable = this;
      if (clickable.attr("id") == "river_click") clickable = SVG.get("river");
      
      if (!hoverFilter) {
        clickable.filter(function(add) {
        add.componentTransfer({
          rgb: { type: 'linear', slope: 1, intercept: 0.2 }
        })
      })
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
      playState.actioned();
      var dscr = descriptions[this.attr('id')];
      $(".popup").remove();
      var popup = $('<div class="popup"><span class="close">X</span><h1>'+dscr.title+'</h1><p>'+dscr.text+' <a href="'+dscr.link+'">Read more</a></p></div>');
      popup.find(".close").click(function() { popup.remove() });
      popup.appendTo(document.body).offset({top: e.y, left: e.x});
    });
  });
  $("#play").css('cursor', 'pointer').mouseover(function() {
    clickable = this.instance;
    if (!hoverFilter) {
      clickable.filter(function(add) {
      add.componentTransfer({
        rgb: { type: 'linear', slope: 1, intercept: 0.2 }
      })
    })
      hoverFilter = clickable.filterer;
    } else {
      clickable.filter(hoverFilter);
    }
  }).mouseout(function() {
    clickable = this.instance;
    clickable.unfilter();
  }).click(function() {
    playState.toggle();
  });
});
