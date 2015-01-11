<?php

require("config.php");
session_start();

?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Dashboard Preferences</title>
    <link rel="stylesheet" href="css/bootstrap-3.2.0-dist/css/bootstrap.min.css" type="text/css" media="screen" title="no title" charset="utf-8">
    <script src="js/vendor/jsoneditor.js" type="text/javascript" charset="utf-8"></script>
    
    <script src="js/vendor/jquery-1.11.0.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/vendor/Pikaday-master/pikaday.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/vendor/Pikaday-master/plugins/pikaday.jquery.js" type="text/javascript" charset="utf-8"></script>
    <link rel="stylesheet" href="js/vendor/Pikaday-master/css/pikaday.css" type="text/css" media="screen" title="no title" charset="utf-8">
    <style type="text/css" media="screen">
      input[type="text"][name*="probability"] {
        width: 41px;
      }
    </style>
  </head>
  <body style="margin: 20px">
    <h1>Dashboard Preferences</h1>

<?php if (!logged_in()) { ?>
<div style="max-width: 500px; margin: 0 auto;">
  <h2>Log In</h2>
  <form class="form-horizontal" method="post">
    <div class="form-group">
      <label for="inputUsername" class="col-sm-2 control-label">Username</label>
      <div class="col-sm-10">
        <input class="form-control" id="inputUsername" name="username" placeholder="Username">
      </div>
    </div>
    <div class="form-group">
      <label for="inputPassword" class="col-sm-2 control-label">Password</label>
      <div class="col-sm-10">
        <input type="password" name="password" class="form-control" id="inputPassword" placeholder="Password">
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-offset-2 col-sm-10">
        <button type="submit" class="btn btn-default">Sign in</button>
      </div>
    </div>
  </form>
</div>
</body>
</html>
<?php
} else {
?>    
    
    <div class="btn-group" role="group">
      <a href="prefs.php?logout=true" class="btn btn-default" role="button">Logout</a>
      <button type="button" class="btn btn-primary" id='submit'>Save</button>
    </div>
    
    <span id='valid_indicator'></span>
    <span id='save_indicator'></span>
    
    <div id='editor_holder' ></div>
    
    <script>
      var starting_value = <?php echo file_get_contents('prefs.json'); ?>;
            
      // JSONEditor.defaults.resolvers.unshift(function(schema) {
      //   if(schema.type === "object" && schema.format === "bins") {
      //     return "bins";
      //   }
      // });
      //
      // JSONEditor.defaults.editors.bins = JSONEditor.AbstractEditor.extend({
      //   build: function() {
      //     console.log("hi");
      //   }
      // });
      
      // Initialize the editor
      var editor = new JSONEditor(document.getElementById('editor_holder'), {        
        schema: {
          type: "object",
          title: "Preferences",
          properties: {
            messageSections: {
              title: "Messages",
              type: "object",
              format: "tabs",
              options: {disable_collapse: false},
              properties: {
                0: {
                  type: "array",
                  title: "Introduction Narration",
                  format: "table",
                  options: {  disable_collapse: false, collapsed: true },
                  items: {
                    type: "object",
                    title: "Message",
                    properties: {
                      probability: { "$ref": "#/definitions/probability" },
                      text: { type: "string", title: "Text", format: "textarea" },
                      startDate: { type: "string", title: "Start Date" },
                      endDate: { type: "string", title: "End Date" },
                      kiosk: { type: "boolean", default: "true", title: "Display on Kiosk?" },
                      web: { type: "boolean", default: "true", title: "Display on Web?" },
                    }
                  }
                },
                1: {
                  type: "array",
                  title: "Resource Category",
                  format: "table",
                  options: {  disable_collapse: false, collapsed: true },
                  items: {
                    type: "object",
                    title: "Message",
                    properties: {
                      probability: { "$ref": "#/definitions/probability" },
                      text: { type: "string", title: "Text", format: "textarea" },
                      state: { type: "string", "enum": ["electricity", "water", "stream", "weather"],title: "State" },
                      kiosk: { type: "boolean", default: "true", title: "Display on Kiosk?" },
                      web: { type: "boolean", default: "true", title: "Display on Web?" },
                    }
                  }
                },
                2: {
                  type: "array",
                  title: "Resource Explanation",
                  format: "table",
                  options: {  disable_collapse: false, collapsed: true },
                  items: {
                    type: "object",
                    title: "Message",
                    properties: {
                      probability: { "$ref": "#/definitions/probability" },
                      text: { type: "string", title: "Text", format: "textarea" },
                      state: { type: "string", "enum": ["electricity", "water", "stream", "weather"],title: "State" },
                      kiosk: { type: "boolean", default: "true", title: "Display on Kiosk?" },
                      web: { type: "boolean", default: "true", title: "Display on Web?" },
                    }
                  }
                },
                3: {
                  type: "array",
                  title: "Level Narration",
                  format: "table",
                  options: {  disable_collapse: false, collapsed: true },
                  items: {
                    type: "object",
                    title: "Message",
                    properties: {
                      probability: { "$ref": "#/definitions/probability" },
                      text: { type: "string", title: "Text", format: "textarea" },
                      state: { type: "string", "enum": ["electricity", "water", "stream", "weather"],title: "State" },
                      kiosk: { type: "boolean", default: "true", title: "Display on Kiosk?" },
                      web: { type: "boolean", default: "true", title: "Display on Web?" },
                    }
                  }
                },
                4: {
                  type: "array",
                  title: "Conservation Suggestion",
                  format: "table",
                  options: {  disable_collapse: false, collapsed: true },
                  items: {
                    type: "object",
                    title: "Message",
                    properties: {
                      probability: { "$ref": "#/definitions/probability" },
                      text: { type: "string", title: "Text", format: "textarea" },
                      state: { type: "string", "enum": ["electricity", "water", "stream", "weather"],title: "State" },
                      kiosk: { type: "boolean", default: "true", title: "Display on Kiosk?" },
                      web: { type: "boolean", default: "true", title: "Display on Web?" },
                    }
                  }
                },
              }
            },
            timing: {
              title: 'Timing',
              options: { disable_collapse: false },
              type: 'object',
              format: 'grid',
              properties: {
                delayBetweenMessages: {
                  type: "number",
                  title: 'Seconds for each message section',                  
                },
                delayBeforePlayMode: {
                  type: 'number',
                  title: 'Seconds before play mode'
                },
                delayWhenPlaying: {
                  type: "number",
                  title: 'Seconds on each screen when playing',
                  description: "Allow enough time for every message section to display!"
                }
              }
            },
            landscape: {
              title: 'Landscape Components',
              options: {
                disable_collapse: false,
                collapsed: true,
                no_additional_properties: false,
                disable_properties: false
              },
              type: 'object',
              format: 'grid',
              additionalProperties: {
                type: 'object',
                format: 'grid',
                properties: {
                  title: {type: "string", title: "Title"},
                  text: {type: "string", title: "Text", format: "textarea"},
                  link: {type: "string", title: "Link"}
                }
              }
            },
            gauges: {
              title: "Gauges",
              options: {
                disable_collapse: false,
                collapsed: true,
                no_additional_properties: false
              },
              type: 'object',
              additionalProperties: {
                type: 'array',
                options: {
                  disable_collapse: false,
                  collapsed: true
                },
                items: {
                  type: 'object',
                  format: 'grid',
                  properties: {
                    gaugeId: {
                      type: "integer", title: "Gauge ID", 
                      description: "http://www.buildingos.com/blocks/XX/"
                    },
                    title: {type: "string", title: "Title"},
                    text: {type: "string", title: "Description", format: "textarea"},
                    link: {type: "string", title: "Link for more info"},
                    buildingdash: {type: "string", title: "Link to building dashboard page"}
                  }
                }
              }
            }
          },
          definitions: {
            probability: { title: "Probability", oneOf: [
              {
                type: "integer", title: "Constant", default: 1
              },
              {
                type: "object", title: "Bins", options: {table_row:true}, properties: {
                  1: {type: "integer", default: 1},
                  2: {type: "integer", default: 1},
                  3: {type: "integer", default: 1},
                  4: {type: "integer", default: 1},
                  5: {type: "integer", default: 1},
                }
              }
            ]},
          }
        },
        
        startval: starting_value,
        //no_additional_properties: true,
        theme: "bootstrap3",
        iconlib: "bootstrap3",
        
        disable_properties: true,
        disable_edit_json: true,
        disable_collapse: true
      });
      
      function save() {
        $('#submit').html('\<span class="glyphicon glyphicon-refresh">\</span>');
        console.log(JSON.stringify(editor.getValue()));
        var indicator = document.getElementById('save_indicator');
        $.post('save.php', { data: JSON.stringify(editor.getValue()) },
          function() {
            $('#submit').html('Save');
            indicator.style.color = 'green';
            var currentdate = new Date(); 
            indicator.textContent = "Saved "+ currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();;
            console.log(arguments);
          }).error(function() {
            console.log(arguments);
            $('#submit').html('Save');
            indicator.style.color = 'red';
            indicator.textContent = "Wrong username/passsword";
          });
      }
      
      document.getElementById('submit').addEventListener('click', save);
      
      // Hook up the validation indicator to update its 
      // status whenever the editor changes
      editor.on('change',function() {
        // Get an array of errors from the validator
        var errors = editor.validate();
        
        var indicator = document.getElementById('valid_indicator');
        
        // Not valid
        if(errors.length) {
          indicator.style.color = 'red';
          indicator.textContent = "Form contents not valid!";
          console.log(errors);
        }
        // Valid
        else {
          indicator.textContent = "";
        }
                
        $('input[name*="startDate"], input[name*="endDate"]').pikaday();
        
        save();
      });
    </script>
  </body>
</html>
<?php } ?>
