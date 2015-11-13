# Citywide-Dashboard
This project was developed as part of the Oberlin Environmental Dashboard. It is an animated display of current electricity use, water use and environmental conditions in the entire community. [See the live version](http://environmentaldashboard.org/cwd-static/)

There are two components to the Citywide-Dashboard: the front-end animated display, and the back-end customization page.

## The Front-end

This page (index.php) is run with jQuery and svg.js. It is a giant svg, mostly with pngs and vector shapes animated around inside. To read more about how it works, read [this](https://cdn.rawgit.com/jeratt/Citywide-Dashboard/master/docs/main.html) docco page.

_Read the docco page because it has valuable vocab information! ;^)_

## The Back-end

This "prefs page" was run by [JSON Editor](https://github.com/jdorn/json-editor) but this runs very slowly on page load, and is not customizable enough for the wide variety of dashboard settings. I'm working on transitioning the page over to React (the javascript library that Facebook uses for user interfaces). *This is where most work is concentrated: in the /prefsReactJS folder.*

### Relevant reading about React:

Intro to React:
* https://facebook.github.io/react/docs/tutorial.html
* http://facebook.github.io/react/docs/thinking-in-react.html

Using React with Forms:
* https://facebook.github.io/react/docs/forms.html
* https://facebook.github.io/react/docs/two-way-binding-helpers.html
* http://n12v.com/2-way-data-binding/

Using styled form components: (for tabs etc)
* https://react-bootstrap.github.io/

How I've installed React:
* https://github.com/newtriks/generator-react-webpack/blob/7f911b54f18a084cb33aa0184da3369fce725912/README.md

This one last one is how I've installed React. I used this "yeoman generator," to initially set up the basic file structure and install the requirements. React is installed as its own server, so it won't work if you try to view /prefsReactJS from an Apache "localhost." To view, navigate to /prefsReactJS in terminal and run "grunt webpack-dev-server." Then navigate to localhost:8000/webpack-dev-server/index.html

## Todo List

Fall 2015:
- Add credits on prefs page (yay)
- Finish prefs data serialization in ReactJS (this is basically the "Add inverse data flow" step of "Thinking in React," involves using two-way binding helper valueLink) 
  - Message probabilities need row key for state tabs (weird bug)
  - Landscape components tab
  - Gauges tab
- Prefs data saving and connect to CWD front-end
- Package up and write installation docs
- W Steve: Connect gauge levels API to front-end dashboard

- Develop extra prefs functionality
  - Extra columns for messages
    - Start date and end date
    - Display on kiosk/web
  - Live preview for gauges
  - Live preview for landscape components
- Multiple users functionality
- Put within wordpress?
- Small fixes on front-end
  - Ajax loading for prefs and svg
  - Switch mode to "none" by clicking on active state button at the top
  - #houseinside hover works with clickables