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
    
  </head>
  <body style="margin: 20px">
    <h1>Dashboard Preferences</h1>
    
    <input type="text" name="username" value="" id="username" placeholder="Username">
    <input type="password" name="password" value="" id="password" placeholder="Password">
    <button id='submit'>Save</button>
    
    <span id='valid_indicator'></span>
    <span id='save_indicator'></span>
    
    <div id='editor_holder' ></div>
    
    <script>
      var starting_value = <?php echo file_get_contents('prefs.json'); ?>; /*{
  "messageSections": [
    {
      "name": "Introduction Narration",
      "simpleMessageSection": true,
      "messages": [
        {
          "probability": 9,
          "text": "Welcome to Oberlin’s Environmental Dashboard.  The Energy Squirrel and Wally the Walleye will tell you about current environmental conditions in Oberlin.  Press the \"play button\" to start."
        },
        {
          "probability": 10,
          "text": "Welcome to Oberlin’s Environmental Dashboard.  The Energy Squirrel and Wally the Walleye will tell you about current environmental conditions in Oberlin and actions you can take.  Choose a resource or press the play button to start."
        },
        {
          "probability": 7,
          "text": "Welcome to Oberlin's Environmental Dashboard.  Try exploring our webpage by scrolling over different parts of the picture below."
        },
        {
          "probability": 10,
          "text": "Welcome to Oberlin's Environmental Dashboard! Let us walk you through this new and exciting community resource. Please press the orange \"play\" button to begin."
        },
        {
          "probability": 5,
          "text": "Welcome to the Bioregional Dashboard.  Explore current environmental conditions in Oberlin by clicking on different icons in the picture below."
        },
        {
          "probability": 10,
          "text": "Welcome to Oberlin's Bioregional Dashboard.  Did you know that less than 1% of the water on Earth is readily accessible to humans?  Click on the icons below to see how water and electricity flow through our city's environment."
        },
        {
          "probability": 9,
          "text": "Welcome to Oberlin's Environmental Resource Dashboard.  Did you know that the Great Lakes hold 20% of the Earth's readily accessible freshwater?  Click on the play button below to learn more."
        },
        {
          "probability": 7,
          "text": "Good day and welcome to Oberlin's Bioregional Dashboard! Click on the icons below to learn more about the existing environmental conditions in Oberlin."
        },
        {
          "probability": 10,
          "text": "Welcome to Oberlin's Environmental Dashboard.  Try exploring by scrolling over the four gauges at the top of the picture."
        },
        {
          "probability": 5,
          "text": " Welcome to Oberlin's Environmental Dashboard.  Did you know that the Great Lakes hold 20% of the Earth's readily accessible freshwater?  Click the gauges above to explore the dashboard."
        },
        {
          "probability": 10,
          "text": "Hello! I'm the Energy Squirrel and I will help you to better understand how resources like electricity and water flow through the City of Oberlin. Click the gauges above to explore!"
        },
        {
          "probability": 9,
          "text": "Hello! This dashboard will help you to better understand how resources like electricity and water flow through the City of Oberlin. Click the gauges above to explore!"
        },
        {
          "probability": 7,
          "text": "Welcome to the Bioregional Dashboard.  Did you know that less than 1% of the water on Earth is readily accessible to humans?  Click on the gauges above to explore our city’s environment."
        },
        {
          "probability": 8,
          "text": "Hi there! A bioregion is an area that constitutes an ecological community with natural, not artificial boundaries. We live in the Great Lakes Region and in the Black River Watershed. Click on the picture below to learn more about our bioregion."
        }
      ]
    },
    {
      "name": "Resource Category",
      "messageSectionWithState": true,
      "messages": [
        {
          "probability": 10,
          "text": "Hello. Welcome to the Bioregional Dashboard's electricity use page. Here you can click on gauges and icons and learn more about energy in our community.",
          "state": "electricity"
        },
        {
          "probability": 9,
          "text": "This view of the dashboard shows community-wide electricity electricity use",
          "state": "electricity"
        },
        {
          "probability": 10,
          "text": "Hello. Welcome to the Bioregional Dashboard's water page. Here you can scroll over the icons and learn all about water in our community.",
          "state": "water"
        },
        {
          "probability": 9,
          "text": "This view of the dashboard shows community-wide water use and treatment",
          "state": "water"
        },
        {
          "probability": 10,
          "text": "Hello. Welcome to the Bioregional Dashboard's watershed page. Here you can click on gauges and icons and learn more about water quality in the Plum Creek and in the Black River Watershed.",
          "state": "stream"
        },
        {
          "probability": 9,
          "text": "This view of the dashboard shows community-wide conditions in the Plum Creek into which water falling on Oberlin drains",
          "state": "stream"
        },
        {
          "probability": 10,
          "text": "Hello. Welcome to the Bioregional Dashboard's weather page. Learn about Oberlin's climate and weather.",
          "state": "weather"
        },
        {
          "probability": 9,
          "text": "This view of the dashboard shows community-wide activity weather conditions",
          "state": "weather"
        }
      ]
    }
  ]
};*/
            
      // Initialize the editor
      var editor = new JSONEditor(document.getElementById('editor_holder'), {        
        schema: {
          type: "object",
          title: "Preferences",
          properties: {
            messageSections: {
              title: "Messages",
              type: "array",
              format: "tabs",
              items: {
                type: "object",
                title: "Message Section",
                headerTemplate: "{{ i }} - {{ self.name }}",
                oneOf: [
                  { $ref: "#/definitions/simpleMessageSection", title: "Simple Messages with Probabilities" },
                  { $ref: "#/definitions/messageSectionWithDate", title: "Messages with Probabilities and Dates" },
                  { $ref: "#/definitions/messageSectionWithState", title: "Messages with Probabilities depending on State" },
                  { $ref: "#/definitions/messageSectionWithStateAndBin", title: "Messages with Probabilities depending on State and Bin" }
                ]
              }
            }
          },
          definitions: {
            selectState: { type: "string", "enum": ["electricity", "water", "stream", "weather"], title: "State" },
            simpleMessageSection: {
              type: "object",
              properties: {
                name: { type: "string", title: "Section Name", default: "Message Section"},
                simpleMessageSection: { type: "boolean", "enum": [ true ], default: true, options: { hidden: true } },
                messages: {
                  type: "array",
                  title: "Messages",
                  format: "table",
                  items: {
                    type: "object",
                    properties: {
                      probability: { type: "integer", title: "Probability", default: 1 },
                      text: { type: "string", title: "Text", format: "textarea" }
                    }
                  }
                }
              }
            },
            messageSectionWithDate: {
              type: "object",
              properties: {
                name: { type: "string", title: "Section Name", default: "Message Section"},
                messageSectionWithDate: { type: "boolean", "enum": [ true ], default: true, options: { hidden: true } },
                messages: {
                  type: "array",
                  title: "Messages",
                  format: "table",
                  items: {
                    type: "object",
                    properties: {
                      probability: { type: "integer", title: "Probability", default: 1 },
                      text: { type: "string", title: "Text", format: "textarea" },
                      startDate: { type: "string", format: "date", title: "Start Date" },
                      endDate: { type: "string", format: "date", title: "End Date" }
                    }
                  }
                }
              }
            },
            messageSectionWithState: {
              type: "object",
              properties: {
                name: { type: "string", title: "Section Name", default: "Message Section"},
                messageSectionWithState: { type: "boolean", "enum": [ true ], default: true, options: { hidden: true } },
                messages: {
                  type: "array",
                  title: "Messages",
                  format: "table",
                  items: {
                    type: "object",
                    properties: {
                      probability: { type: "integer", title: "Probability", default: 1 },
                      text: { type: "string", title: "Text", format: "textarea" },
                      state: { $ref: "#/definitions/selectState" }
                    }
                  }
                }
              }
            },
            messageSectionWithStateAndBin: {
              type: "object",
              properties: {
                name: { type: "string", title: "Section Name", default: "Message Section"},
                messageSectionWithStateAndBin: { type: "boolean", "enum": [ true ], default: true, options: { hidden: true } },
                messages: {
                  type: "array",
                  title: "Messages",
                  format: "table",
                  items: {
                    type: "object",
                    properties: {
                      probability: {
                        type: "object", title: "Probabilities", "format": "grid", properties: {
                          1: {type: "integer", default: 1},
                          2: {type: "integer", default: 1},
                          3: {type: "integer", default: 1},
                          4: {type: "integer", default: 1},
                          5: {type: "integer", default: 1},
                        }
                      },
                      text: { type: "string", title: "Text", format: "textarea" },
                      state: { $ref: "#/definitions/selectState" }
                    }
                  }
                }
              }
            }
          }
        },
        
        startval: starting_value,
        no_additional_properties: true,
        theme: "bootstrap3",
        iconlib: "bootstrap3",
        
        disable_properties: true,
        disable_edit_json: true,
        disable_collapse: true
      });
      
      document.getElementById('submit').addEventListener('click',function() {
        $('#submit').html('\<span class="glyphicon glyphicon-refresh">\</span>');
        console.log(JSON.stringify(editor.getValue()));
        var indicator = document.getElementById('save_indicator');
        $.post('save.php', {
          data: JSON.stringify(editor.getValue()),
          username: $('#username').val(),
          password: $('#password').val() },
          function() {
            $('#submit').html('Save');
            indicator.style.color = 'green';
            indicator.textContent = "Saved";
            console.log(arguments);
          }).error(function() {
            console.log(arguments);
            $('#submit').html('Save');
            indicator.style.color = 'red';
            indicator.textContent = "Wrong username/passsword";
          });
      });
      
      // Hook up the validation indicator to update its 
      // status whenever the editor changes
      editor.on('change',function() {
        // Get an array of errors from the validator
        var errors = editor.validate();
        
        var indicator = document.getElementById('valid_indicator');
        
        // Not valid
        if(errors.length) {
          indicator.style.color = 'red';
          indicator.textContent = "Not valid";
          console.log(errors);
        }
        // Valid
        else {
          indicator.style.color = 'green';
          indicator.textContent = "Valid";
        }
        
        // $('input[type="date"]').datepicker().on('changeDate', function(ev){
        //   console.log(editor.getEditor($(ev.target).parent().parent().data('schemapath')));
        //   console.log(ev.target.value);
        //   editor.getEditor($(ev.target).parent().parent().data('schemapath')).setValue(ev.currentTarget.value);
        // });
        
        $('input[type="date"]').pikaday();
      });
    </script>
  </body>
</html>
