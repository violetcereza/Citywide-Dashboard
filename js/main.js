// # main.js aka partie central

// # A Vocab Lesson

// *Gauge:* The blocks on the right side from building dashboard

// *Bin/level:* The relative use indicator on the gauge. We were thinking of using the top gauge for whatever state you're in

// *State:* Water, Electricity, Stream, or Weather

// *Button:* Mainly refers to the state buttons at the top of the dashboard.

// *Message:* The text below the state buttons at the top. It has several different "message sections" that it shifts through every couple seconds. Some sections are state dependent, some are even bin dependent.

// *Landscape components/clickables:* Everything you see on the landscape that lights up and you can click on it to see a description.

// *Character:* The little squirrel or fish in the top left.

// **************

// # URL functionality

// ## #state

// Jump to state.

// ## ?version=cleveland

// Access different versions of the dashboard via their name on the prefs page.

// ## ?context=noplay

// Hide play button and don't automatically start playing. For presentations and stuff where you want to stick to one state and talk about it.

// ## ?context=kiosk

// Hide state buttons and automatically start playing. A lot cleaner visually for when the user won't be able to click.


// **************

// Because Illustrator modifies attr and not style, so showing with svg.js doesn't work unless we do too
SVG.extend(SVG.Element, {
  hide: function() {
    return this.attr('display', 'none');
  },
  show: function() {
    return this.attr('display', '');
  }
});

// First, retrieve the svg file and the prefs JSON file
var prefs;
var prefsAjax = $.get('prefs.json');
var svgAjax = $.get('dashboard.svg');
console.log(svgAjax, prefsAjax);

// We wait until they are both loaded before hiding the loading screen (this is a clunky hardcoded wating time)
window.setTimeout(function(){

  // # URL processing, setting up SVG

  // From http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  function getURLParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  // Search for the correct dashboard where name == "?version=" from url
  var i = 0;
  var dashboardName = getURLParameterByName('version').toLowerCase();
  if (dashboardName.length > 0) {
    while (prefsAjax.responseJSON[i].name.toLowerCase() != dashboardName) i++;
  }
  prefs = prefsAjax.responseJSON;//[i];

  // Put the loaded SVG on the page and hide the loading screen.
  // Maybe it would make more sense to have the SVG hardcoded into index.php?
  var draw = SVG('svg-container');
  draw.svg(svgAjax.responseText);
  draw = SVG.get('drawing');
  $("#drawing").attr("width", "100%").attr("height", "100%");
  window.setTimeout(function() {
    $("#loader").hide();
  }, 2000);

  // # Custom Images of Buildings

  for (clickable in prefs.landscape) {
    // If the image url is not blank, plug that url in!
    if (prefs.landscape[clickable].image.length > 1) {
      var el = SVG.get(clickable);
      // Currently, all image urls are relative to dashboard/img
      el.attr('href', 'img/'+prefs.landscape[clickable].image);
      if (prefs.landscape[clickable].imageWidth) {
        el.width(prefs.landscape[clickable].imageWidth);
      }
      if (prefs.landscape[clickable].imageHeight) {
        el.height(prefs.landscape[clickable].imageHeight);
      }
      if (prefs.landscape[clickable].imageXOffset) {
        el.dx(prefs.landscape[clickable].imageXOffset);
      }
      if (prefs.landscape[clickable].imageYOffset) {
        el.dy(prefs.landscape[clickable].imageYOffset);
      }
     }
  }

  // # Continual animations

  // Thank you SVG.js :-*

  SVG.get("ship").animate(40000, '-').dmove(1350, -50).loop();
  SVG.get("blades").transform({cx: 19, cy: 25}).animate(2000, '-').transform({rotation: 360}).loop();

  var pipes = SVG.select("#svg-container #pipes > image");
  var smoke = SVG.get('smoke');
  var pipesOut = function() {
    pipes.each(function() {
      this.load("img/smokestack/smokestack1.png");
    });
    // smoke.animate(1000, ">").dmove(0,-300).transform({scale: 2}).attr('opacity', 0).after(function() {
    //   this.attr('opacity', 1).translate(0,0).scale(1);
    // });

    window.setTimeout(pipesIn, 1000);
  }
  var pipesIn = function() {

    pipes.each(function() {
      this.load("img/smokestack/smokestack2.png");
    });
    window.setTimeout(pipesOut, 1000);
  }
  pipesIn();

  // # Character and Gauges

  var character = $("#character");
  var gauges = $("#gauges");

  character.css("position", "absolute");
  gauges.css({position: "absolute", width: 286, height: 735});
  // Kiosk mode "?context=kiosk" makes all sorts of tweaks throughout the program
  if (getURLParameterByName('context') == "kiosk") {
    SVG.get("top_menu_side").hide();
  }
  // Gauges and characters are elements that are dynamically positioned *over* the SVG.
  // This function figures out how to center and scale them so they look part of the SVG.
  var rescaleElements = function() {
    var width = $('#background').get(0).getBoundingClientRect().width;
    var scale = width / 1584; // Original width of SVG
    var x = ($(document.body).width()-width)/2;

    var kioskMode = 0;
    if (getURLParameterByName('context') == "kiosk") {
      kioskMode = 1;
    }

    character.css({
      transform: 'scale('+scale+')',
      left: x+'px',
      top: $("#background").offset().top+"px",
      '-webkit-transform-origin': "top left",
      '-moz-transform-origin': "top left",
      '-ms-transform-origin': "top left",
      '-o-transform-origin': "top left"
    });

    gauges.css({
      transform: 'scale('+scale+')',
      right: x+(20*scale)+'px',
      top: 75*scale+$("#background").offset().top+"px",
      '-webkit-transform-origin': "top right",
      '-moz-transform-origin': "top right",
      '-ms-transform-origin': "top right",
      '-o-transform-origin': "top right"
    });
  }
  rescaleElements();
  // I could have just run the function via window.onresize, but I think that fires too often when scaling
  window.setInterval(rescaleElements, 1000);

  // Waiting on lucid for live gauge levels.
  // We need the gauge to use the postmessage framework to communicate the relative
  // use level because XSS stuff prevents us from reading it directly.
  var getBin = function() {
    // Right now, we have an option to just not have level based functionality. (see prefs page)
    if (prefs.disableLevels) {
      return 3;
    } else {
      if (false){
        return gaugesIFrame.get(0).contentWindow.getBin();
      } else {
        return 3;
      }
    }
  }
  // Iframes! We just plug in the gaugeId to the buildingos url
  var updateGauges = function(state) {
    var state = state? state : 'none';
    gauges.empty();
    if (prefs.gauges[state]) {
      for (var i = prefs.gauges[state].length - 1; i >= 0; i--) {
        gauges.prepend('<iframe src="http://www.buildingos.com/blocks/'+prefs.gauges[state][i].gaugeId+'/" allowtransparency="true" frameBorder=0 height="'+prefs.gauges[state][i].height+'" scrolling="no" width="286"></iframe>');
      }
    }
  }
  updateGauges();

  // There are two characters (walley and flash) with 3 emotion animations each
  var setCharacterAnim = function(anim) {
    if (character.attr('src') != 'img/'+anim+'.mp4') {
      character.attr('src', 'img/'+anim+'.mp4');
    }
  }
  var setCharacter = function(character) {
    // With bin functionality disabled, only neutral gets used
    var bin = getBin();
    var emote;
    if (character == "squirrel") {
      switch (bin) {
      case 1:
        emote = 'happy';
        break;
      case 2:
        emote = 'neutral';
        break;
      case 3:
        emote = 'neutral';
        break;
      case 4:
        emote = 'neutral';
        break;
      case 5:
        emote = 'angry';
        break;
      }
    } else if (character == "fish") {
      switch (bin) {
      case 1:
        emote = 'happy';
        break;
      case 2:
        emote = 'neutral';
        break;
      case 3:
        emote = 'neutral';
        break;
      case 4:
        emote = 'neutral';
        break;
      case 5:
        emote = 'sad';
        break;
      }
    }
    setCharacterAnim(character+"/"+emote+(getURLParameterByName('context') == "kiosk"?"-kiosk":""));
  }

  // # State-based animations

  // http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
  function htmlEncode( html ) {
      return document.createElement( 'a' ).appendChild(
          document.createTextNode( html ) ).parentNode.innerHTML;
  }

  // ## Rotating top messages

  var messageHeight = getURLParameterByName('context') == "kiosk"? 100 : 60;
  // Resize text to fit container.
  // Basically by trial and error size it up and up and up until it's too big.
  function resizeMessage() {
    var interval;
    var size = 19;
    interval = window.setInterval(function() {
      size++;
      text.css({ fontSize: size });

      // Force redraw
      fObj.dmove(1,0);
      fObj.dmove(-1,0);

      if (text.height() > messageHeight) {
        window.clearInterval(interval);
        text.css({ fontSize: size-2 });
      }
    }, 0);
  }

  // Messages are a "foreignObject" which is an HTML element *within* the SVG. (it's greatt)
  var fObj = draw.foreignObject(1000, 100).move(200, 80);
  fObj.appendChild("div", { innerText: "Welcome to Oberlin's Bioregional Dashboard! Click on the icons above to learn more out the environmental conditions at Oberlin."});
  var text = $(fObj.getChild(0));
  text.css({ fontFamily: 'Futura-Medium, Futura, futura, sans-serif', fontSize: 19, color: "#777" });
  resizeMessage();
  var messageSection;
  // Relative probabilities for selecting messages.
  function selectMessage(section) {
    // Go to the section we want to display
    var sourceMessages = prefs.messageSections[section.toString()];

    var selectedMessages = [];
    var selectedWeights = [];
    for (var i = sourceMessages.length - 1; i >= 0; i--) {
      // Filter by current state (if message.state is not empty)
      if (sourceMessages[i].state && !state.is(sourceMessages[i].state)) continue;
      // Filter by date (if message.startDate and message.endDate are not empty)
      if (sourceMessages[i].startDate && sourceMessages[i].endDate) {
        if ( moment().isBefore(moment(sourceMessages[i].startDate, "ddd MMM DD YYYY")) ) continue;
        if ( moment().isAfter(moment(sourceMessages[i].endDate, "ddd MMM DD YYYY")) ) continue;
      }
      // Filter by context (some messages are like "click here" and Jon didn't want this to display in a context where users can't click)
      if (sourceMessages[i].kiosk == false) {
        if ( getURLParameterByName('context') == "kiosk" ) continue;
      }
      if (sourceMessages[i].web == false) {
        if ( getURLParameterByName('context') != "kiosk" ) continue;
      }

      selectedMessages.push(sourceMessages[i].text);
      if (typeof sourceMessages[i].probability == "number") {
        selectedWeights.push(sourceMessages[i].probability);
      } else {
        // Bin based relative probabilities (so certain messages can be more probable in certain bins)
        selectedWeights.push(sourceMessages[i].probability[getBin()]);
      }
    }

    if (selectedMessages.length == 0) {
      return '';
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
    text.css({ fontSize: 19 });
    text.text(htmlEncode(getRandomItem(selectedMessages, selectedWeights)));
    resizeMessage();
  }
  selectMessage(0);

  // ## The State Machine!
  // State machine framework thanks to https://github.com/jakesgordon/javascript-state-machine

  // intervalObjs is for state based animations that need to be closed out when we shift out of that state.
  var intervalObjs = [];
  var state = StateMachine.create({
    events: [
      { name: 'toElectricity', from: '*', to: 'electricity' },
      { name: 'toWater', from: '*', to: 'water' },
      { name: 'toStream', from: '*', to: 'stream' },
      { name: 'toWeather', from: '*', to: 'weather' },
      { name: 'next', from: 'none', to: 'electricity' },
      { name: 'next', from: 'weather', to: 'electricity' },
      { name: 'next', from: 'electricity', to: 'water' },
      { name: 'next', from: 'water', to: 'stream' },
      { name: 'next', from: 'stream', to: 'weather' }],
    callbacks: {
      // ### Electricity
      onelectricity: function() {
        SVG.get('powerlines_lit').show();
        SVG.get('powerlines_lit_back').show();
        setCharacter('squirrel');

        var startTime = new Date();
        var duration = 2;
        $("#sparkpaths > path, #sparkpaths_back > path").each(function() {
          var path = this;
          var spark = draw.circle(15).move(-15,-15).fill(draw.gradient('radial', function(stop) {
            stop.at(0, "#FDF502")
            stop.at(1, '#FDCC02')
          })).attr("class", "spark");
          $(path.parentNode).after(spark);
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
        SVG.get('powerlines_lit').hide();
        SVG.get('powerlines_lit_back').hide();
        SVG.select(".spark").each(function() { this.remove(); });
      },
      // ### Water
      onwater: function() {
        var clip = draw.clip();
        SVG.get('freshwater_highlighted').show();
        SVG.get('wastewater_highlighted').show();
        setCharacter('fish');
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
        SVG.select(".droplet").each(function() { this.remove(); });
      },
      // ### Stream
      onstream: function() {
        var clip = draw.clip();
        SVG.get("flow_marks").show().clipWith(clip);
        setCharacter('fish');

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
        SVG.select(".flowshine").each(function() { this.remove(); });
      },
      // ### Weather
      onweather: function() {
        // Sunset functionality disabled because the background behind the character is build in to the animation so it doesn't look good.
        /* SVG.get("sunset").show(); */
        setCharacter('squirrel');
      },
      onleaveweather: function() {
         /* SVG.get('sunset').hide() */
      },
      // ### None
      // None state is what happens when you load the page before selecting a state.
      onnone: function() {
        SVG.get('house_inside').hide();
        setCharacter('squirrel');
      },
      onleavenone: function() {
        SVG.get('house_inside').show();
      },
      // ### On Every State
      onstate: function(event, from, to) {
        window.location.hash = to;

        if (getURLParameterByName('context') == "kiosk") {
          SVG.get('buttons').each(function() {
            this.hide();
          });
          SVG.get(to).show();
          SVG.get(to+"_label").show();
        } else {
          // Top menu buttons
          SVG.get(to).hide();
          SVG.get(to+"_hover").hide();
          SVG.get(to+"_highlight").show();
        }

        // Stick figures
        SVG.get('stick_figures').each(function() {
          this.hide();
        });
        if (SVG.get('stick_'+to)) SVG.get('stick_'+to).show();

        // Message at top
        if (to == "none") {
          selectMessage(0);
        } else {
          messageSection = 0;
          selectMessage(messageSection+1);
          intervalObjs.push(window.setInterval(function() {
            messageSection = (messageSection+1) % 4//(prefs.messageSections.length-1);
            // When levels are disabled, skip Level Narration message section
            if (prefs.disableLevels && (messageSection+1) == 3) messageSection++;
            selectMessage(messageSection+1);
          }, prefs.timing.delayBetweenMessages*1000));
        }

        updateGauges(to);
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
  // ## Context based modifications
  if (getURLParameterByName('context') == "noplay") {
    SVG.get('play').hide();
  }
  // ### In kiosk mode, put all the buttons on the sidebar there.
  if (getURLParameterByName('context') == "kiosk") {
    SVG.get('play').hide();
    SVG.get('top_menu').hide();
    fObj.move(200, 30);
    SVG.get('buttons').each(function() {
      this.hide();
      this.attr('transform', '');
      if (this.node.tagName == "image") {
        this.center(1420, 45);
      } else if (this.node.tagName == "text") {
        this.center(1400, 45);
      }
    });
    prefs.timing.delayBeforePlayMode = 0;
    state.toElectricity();
  }

  // ### Allow button label customization
  SVG.get('buttons').each(function() {
    if (this.node.tagName == "text") {
      // Trims the "_label" off of "electricity_label" etc
      var type = this.attr("id").slice(0, -6);
      if (prefs.buttonLabels[type]) {
        this.text(prefs.buttonLabels[type]);
      }

      // IDK why svg.js creates a tspan child for each text element and adds a "dy" property ¯\_(ツ)_/¯
      //this.node.childNodes[0].instance.attr({dy: "", dx:""});
      this.style({ "pointer-events": 'none' });
    }
  });

  // If we're loading the page with #electricity or something, transition to it now.
  if (window.location.hash) {
    state[ "to" + window.location.hash.charAt(1).toUpperCase() + window.location.hash.slice(2) ]();
    state[ "to" + window.location.hash.charAt(1).toUpperCase() + window.location.hash.slice(2) ]();
  } else {
    setCharacter('squirrel');
  }

  // # Play button

  // playIntervalObj holds the timers for the whole playing situation.
  var playIntervalObj;
  // playBarMask is the loading bar in the back of the play button while it's playing.
  var playBarMask = draw.rect(0, 30).move(200, 160).fill('white');
  SVG.get('darkplay').hide().maskWith(playBarMask);
  // ## Play button state machine
  // *waiting:* Waits delayBeforePlayMode seconds before shifting to playing.

  // *playing:* Waits delayWhenPlaying before shifting to next state.

  // *action:* Triggered when it waiting mode, and user interacts with something. Resets delayBeforePlayMode timer and goes back to waiting.
  var playState = StateMachine.create({
    initial: "action",
    events: [
      { name: 'actioned', from: 'waiting', to: 'action' },
      { name: 'actioned', from: 'playing', to: 'playing' },
      { name: 'toAction', from: '*', to: 'action' },
      { name: 'toWaiting', from: '*', to: 'waiting' },
      { name: 'toPlaying', from: '*', to: 'playing' },
      { name: 'toggle', from: 'waiting', to: 'playing' },
      { name: 'toggle', from: 'playing', to: 'action' }],
    callbacks: {
      onaction: function() {
        var playState = this;
        playState.toWaiting();
        if (getURLParameterByName('context') != "noplay") {
          playIntervalObj = window.setInterval(function() {
            playState.toPlaying();
          }, prefs.timing.delayBeforePlayMode*1000);
        }
      },
      onplaying: function() {
        SVG.get("playtext").hide();
        SVG.get("pausetext").show();
        SVG.get('darkplay').show();

        if (getURLParameterByName('context') != "kiosk") {
          state.next();
        }
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

  // # Button Interaction

  // ## State Buttons
  if (getURLParameterByName('context') != "kiosk") {

    SVG.select("#buttons > image").each(function() {
      // In the SVG, there are 3 different button images layered over each state button.
      // We hide one and show the other (by id) when the button is hovered or active.
      var thisState = this.attr("id").split("_")[0]; // electricity, water, etc
      var thisType = this.attr("id").split("_")[1]; // hover, "", highlight

      this.mouseover(function() {
        playState.actioned();
        if (!state.is(thisState) && thisType!="hover") {
          this.hide();
          SVG.get(thisState+"_hover").show();
        }
      });
      var button = this;
      var mouseout = function() {
        if (!state.is(thisState) && thisType=="hover") {
          button.hide();
          SVG.get(thisState).show();
        }
      };
      $(button.node).mouseleave(mouseout);
      // This still doesn't completely eliminate hover bugs, if you move the mouse rapidly down crossing the button >:(
      $(document).mouseleave(mouseout);
      button.click(function() {
        if (thisState == state.current) { return; }

        playState.toAction();
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

  }

  // ## Landscape Components / Clickables

  var hoverFilter;
  if (getURLParameterByName('context') != "kiosk")
  SVG.select("#clickables > *").each(function() {
    clickable = this;

    clickable.node.style.cursor = "pointer";

    clickable.mouseover(function() {
      playState.actioned();
      clickable = this;
      if (clickable.attr("id") == "river_click") clickable = SVG.get("river");

      // This filter lightens the image via *SVG magic.*
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
      var dscr = prefs.landscape[this.attr('id')];
      $(".popup").remove();
      var text = dscr.text;
      if (dscr.link) {
        text += ' <a href="'+dscr.link+'" target="_blank" >Read more</a>';
      }
      var popup = $('<div class="popup"><span class="close">X</span><h1>'+dscr.title+'</h1><p>'+text+'</p></div>');
      // Popup with description when you click on a lanscape component
      popup.find(".close").click(function() { popup.remove() });
      popup.appendTo(document.body).offset({top: e.y, left: e.x});
    });
  });

  // ## Gauge descriptions on mouseover
  gauges.on("mouseover", "iframe", function(e) {
    // http://stackoverflow.com/questions/16695369/how-to-get-last-folder-name-from-folder-path-in-javascript
    var gaugeId = this.src.match(/([^\/]*)\/*$/)[1];
    var dscr = null;
    for (var state in prefs.gauges) {
      for (var i = prefs.gauges[state].length - 1; i >= 0; i--) {
        if (prefs.gauges[state][i].gaugeId == gaugeId) {
          dscr = prefs.gauges[state][i];
          break;
        }
      }
      if (dscr != null) break;
    }

    playState.actioned();
    $(".popup").remove();
    var text = dscr.text;
    if (dscr.link != "") {
      text += ' <a target="_blank" href="'+dscr.link+'">Read more</a>';
    }
    if (dscr.link != "" && dscr.buildingdash != "") {
      text += ' or ';
    }
    if (dscr.buildingdash != "") {
      text += '<a target="_blank" href="'+dscr.buildingdash+'">View on Building Dashboard</a>';
    }
    var popup = $('<div class="popup"><h1>'+dscr.title+'</h1><p>'+text+'</p></div>');
    popup.mouseenter(function() {
      this.isOver = true;
    });
    popup.mouseleave(function() {
      popup.remove();
    });

    var offset = $(this).offset();
    popup.appendTo(document.body).offset({top: offset.top, left: offset.left-popup.width()});
  });
  gauges.mouseleave(function() {
    // Ugh more complicated than it needs to be?
    window.setTimeout(function() {
      if ($(".popup").get(0) && !$(".popup").get(0).isOver) {
        $(".popup").remove();
      }
    }, 0);
  });

  // ## Play button interaction
  // Can we move this up to the other play button code?
  $("#play").css('cursor', 'pointer').mouseover(function() {
    clickable = SVG.get("play");
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
    clickable = SVG.get("play");
    clickable.unfilter();
  }).click(function() {
    playState.toggle();
  });

// SEEE? Clunky hardcoded loading time wtf
}, 2000);
