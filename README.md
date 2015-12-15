# Citywide Dashboard
This project was developed as part of the [Oberlin Environmental Dashboard](http://environmentaldashboard.org/). It is an animated display of current electricity use, water use and environmental conditions in the entire community. [See the live version](http://environmentaldashboard.org/cwd-static/)

There are two components to the Citywide-Dashboard: the front-end animated display, and the back-end customization page.

## Installation

To install the dashboard, simply download this repository and upload to your server. Your sever should be able to run PHP, because it is utilized to store the custom preferences and authenticate users. Navigate to index.php to view the default dashboard.

## Customization

First, open up prefs/config.php and set your custom username and password. Then, open prefs/ in a web browser and log in. You should be presented with a preferences page [like this.](https://cdn.rawgit.com/jeratt/Citywide-Dashboard/master/prefsReactJS/dist/index.html)

All the preferences are stored in the prefs.json file once saved. The preferences page is basically just a fancy way to edit the json file. If you feel comfortable editing the prefs.json file directly, you may do so.

### Messages

This should be pretty intuitive. These "messages" are the text at the top of the dashboard. The dashboard will cycle through each "message section" on the left, and will (for example) only display "Weather" messages when the "Weather" mode is active on the dashboard.

### Timing

These options are explained on the preferences page.

### Landscape Components

These refer to the images on the dashboard landscape. This will allow you to customize the appearance of the dashboard to match your own community! For example, if you wanted to substitute the big buildings on the center left, you would edit the "The Town of Oberlin" component. Try changing the "Image URL" to "cleveland_city.gif".

Alternative images for landscape components should be uploaded to the img/ folder. Then, change the "Image URL" to reference them. If you need to tweak the location or size of the new image, use the "Custom Image" positioning and sizing fields.

### Gauges

These gauges are pulled from the buildingos.com "Building Blocks" functionality. Once you create your "building blocks" on the buildingos.com platform, you should be able to plug their "Gauge ID" into here.

We currently can't detect how tall a gauge is, so you will have to determine how much space to give it by hand. The live preview should help with this.

You can also give some additional description information to display when the user hovers over the gauge.

# Developer Notes

## The Front-end

The front-end page (index.php) is run with jQuery and svg.js. It is a giant svg, mostly with pngs and vector shapes animated around inside. To read more about how it works, read [this](https://cdn.rawgit.com/jeratt/Citywide-Dashboard/master/docs/main.html) docco page.

_Read the docco page because it has valuable vocab information! ;^)_

## The Back-end

This "prefs page" is run with React (the javascript library that Facebook uses for user interfaces). I am building the React app in the prefsReactJS/ folder, and then copying the compiled files into the prefs/ folder for deployment. I realize this is a clunky process, and I need to figure out a better workflow.

To compile the React app from the code in prefsReactJS/src/components, navigate to prefsReactJS/ on a command line. Run "npm run dist".

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
* https://github.com/newtriks/generator-react-webpack

This one last one is how I've installed React. I used this "yeoman generator," to initially set up the basic file structure and install the requirements. To view, navigate to /prefsReactJS in terminal and run "npm start." Then navigate to localhost:8000/webpack-dev-server/index.html

## Todo List

Fall 2015:
- <del>Add credits on prefs page (yay)</del>
- Finish prefs data serialization in ReactJS (this is basically the "Add inverse data flow" step of "Thinking in React," involves using two-way binding helper valueLink)
  - <del>Message probabilities need row key for state tabs (weird bug)</del>
  - <del>Convert string data back into ints</del>
  - <del>Landscape components tab</del>
  - <del>Gauges tab</del>
  - Add and remove rows from tables
- <del>Prefs data saving and connect to CWD front-end</del>
- <del>Package up and write installation docs</del>
- Non-clunky workflow for bridging React and PHP

The future:
- W Steve: Connect gauge levels API to front-end dashboard
- Develop extra prefs functionality
  - Max and min for probabilities
  - Rename landscape components to "Landmark Icons"
  - Extra columns for messages
    - Start date and end date
    - Display on kiosk/web
  - Live preview for gauges
  - Live preview for landscape components
  - "Button Labels" settings in Timing Tab
- Multiple users functionality
- Put within wordpress?
  - Can the react prefs page be dropped within the wordpress backend?
- Use webpack with front-end
- Modularize front-end
- Small fixes on front-end
  - Ajax loading for prefs and svg
  - Switch mode to "none" by clicking on active state button at the top
  - #houseinside hover works with clickables
  - Fix font display (we want futura!)
