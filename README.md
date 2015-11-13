# Citywide-Dashboard
This project was developed as part of the Oberlin Environmental Dashboard. It is an animated display of current electricity use, water use and environmental conditions in the entire community. [See the live version](http://environmentaldashboard.org/cwd-static/)

There are two components to the Citywide-Dashboard: the front-end animated display, and the back-end customization page.

## The Front-end

This page (index.php) is run with jQuery and svg.js. It is a giant svg, mostly with pngs and vector shapes animated around inside. To read more about how it works, read [this](https://cdn.rawgit.com/jeratt/Citywide-Dashboard/master/docs/main.html) docco page.

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

- Add credits on prefs page
- Finish data serialization in ReactJS
  - Message probabilities need row key for state tabs
  - Landscape components tab
  - Gauges tab
- Data saving and connect to CWD front-end
- Develop extra prefs functionality
- Multiple users functionality
- Put within wordpress?
- Small fixes on front-end
  - Ajax loading for prefs and svg
  - Switch mode to "none" by clicking on active state button at the top
  - #houseinside hover works with clickables
