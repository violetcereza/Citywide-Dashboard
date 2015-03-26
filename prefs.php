<?php

require("config.php");
if (!logged_in()) {
  header("Location: ./login.php");
}

?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Citywide Dashboard Preferences</title>
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
      #valid_indicator {
        margin-left: 10px;
      }
      #nav {
        position: fixed;
        top: 0;
        right: 0;
        padding: 10px;
        background: white;
        z-index: 100;
        border: solid #e3e3e3;
        border-width: 0 0 1px 1px;
      }
    </style>
  </head>
  <body style="margin: 20px">
    <h1>Dashboard Preferences</h1>
    
    <div id="nav">
      <div class="btn-group" role="group">
        <a href="prefs.php?logout=true" class="btn btn-default" role="button">Logout</a>
        <button type="button" class="btn btn-primary" id='submit'>Save</button>
      </div>
      <a href="./" id="gotolive" target="_blank">View Selected Version Live &rarr;</a>
    
      <span id='valid_indicator'></span>
      <span id='save_indicator'></span>
    </div>
    
    <div id='editor_holder' ></div>
    
    <script>
      var starting_value = <?php echo file_get_contents('prefs.json'); ?>;
            
      // Initialize the editor
      var editor = new JSONEditor(document.getElementById('editor_holder'), {        
        schema: {
          type: "array",
          title: " ",
          format: "tabs",
          options: {disable_array_delete: true, disable_array_reorder: true},
          items: {
            type: "object",
            title: "Dashboard Version",
            headerTemplate: "{{ self.name }}",
            options: {disable_array_delete: false},
            properties: {
              name: {
                type: "string",
                title: "Dashboard Name"
              },
              disableLevels: {
                type: "boolean",
                format: "checkbox",
                title: "Disable levels functionality",
                description: "Since we can't yet access the relative use indicators from gauges, this disables Level Narration text and level-based character animations."
              },
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
                    image: {
                      type: "string",
                      title: "Image URL",
                      description: "If blank, default image will be used.",
                      default: "",
                      links: [
                        {
                          "href": "img/{{self}}",
                          "mediaType": "image/*"
                        }
                      ]
                    },
                    imageWidth: {type: "integer", title: "Custom Image Width"},
                    imageHeight: {type: "integer", title: "Custom Image Height"},
                    imageXOffset: {type: "integer", title: "Custom Image X Position Offset"},
                    imageYOffset: {type: "integer", title: "Custom Image Y Position Offset"},
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
                        type: "string", title: "Gauge ID", 
                        description: "buildingos.com/blocks/XX/"
                      },
                      height: {
                        type: "integer", title: "Gauge Height", 
                        description: "190 for one line titles, 210 for two",
                        default: 220
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
      
      // This is sooooo clunky
      // It selects the currently active dashboard version based on css styles
      function updateGoToLiveLink() {
        var version = $("#editor_holder .col-md-2 .list-group-item.active").text();
        $("#gotolive").attr("href", "./?version="+version);
      }
      updateGoToLiveLink();
      $("#editor_holder .col-md-2 .list-group-item").on('click', function() {
        updateGoToLiveLink();
      });
    </script>
  </body>
</html>
