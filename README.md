# Citywide-Dashboard
This project was developed as part of the Oberlin Environmental Dashboard. It is an animated display of current electricity use, water use and environmental conditions in the entire community. [See the live version](http://environmentaldashboard.org/cwd-static/)

There are two components to the Citywide-Dashboard: the front-end animated display, and the back-end customization page.

## The Front-end

This page (index.php) is run with jQuery and svg.js. It is a giant svg, mostly with pngs and vector shapes animated around inside. To read more about how it works, read [this](https://cdn.rawgit.com/jeratt/Citywide-Dashboard/master/docs/main.html) docco page.

## The Back-end

This "prefs page" used to be run by [JSON Editor](https://github.com/jdorn/json-editor) but this runs very slowly on page load, and is not customizable enough for the wide variety of dashboard settings. I'm working on transitioning the page over to React (the javascript library that Facebook uses for user interfaces). This is where most work is concentrated: in the /prefsReactJS folder.

Relevant reading about React:

* https://facebook.github.io/react/docs/tutorial.html
* http://facebook.github.io/react/docs/thinking-in-react.html
* https://facebook.github.io/react/docs/forms.html
* https://facebook.github.io/react/docs/two-way-binding-helpers.html
* https://react-bootstrap.github.io/
* https://github.com/newtriks/generator-react-webpack/blob/7f911b54f18a084cb33aa0184da3369fce725912/README.md
* http://n12v.com/2-way-data-binding/
