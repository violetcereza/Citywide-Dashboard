<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Prefs</title>
    <link rel="stylesheet" style="text/css" href="deps/opt/bootstrap.css" />
  </head>
  <body style="padding: 2em;">
    <h1>Prefs</h1>
    <form></form>
    <div id="res" class="alert"></div>
    <script type="text/javascript" src="deps/jquery.min.js"></script>
    <script type="text/javascript" src="deps/underscore.js"></script>
    <script type="text/javascript" src="deps/opt/jsv.js"></script>
    <script type="text/javascript" src="lib/jsonform.js"></script>
    <script type="text/javascript">
      $('form').jsonForm({
        schema: {
          type: "object",
          title: "Preferences",
          properties: {
            messageSections: {
              title: "Messages",
              type: "array",
              format: "tabs",
              options: {disable_collapse: false},
              items: {
                type: "object",
                title: "Message Section",
                headerTemplate: "{{ i }} - {{ self.name }}",
                properties: {
                  name: { type: "string", title: "Section Name", default: "Message Section"},
                  messages: {
                    type: "array",
                    title: "Messages",
                    format: "table",
                    options: {  disable_properties: false },
                    items: {
                      type: "object",
                      title: "Message",
                      options: {  disable_properties: false },
                      properties: {
                        probability: { title: "Probability", type: "integer", default: 1 },
                        text: { type: "string", title: "Text", format: "textarea" },
                        startDate: { type: "string", format: "date", title: "Start Date" },
                        endDate: { type: "string", format: "date", title: "End Date" },
                        state: { type: "string", "enum": ["electricity", "water", "stream", "weather"],title: "State" }
                      }
                    }
                  }
                }
              }
            },
            timing: {
              title: "Timing",
              options: { disable_collapse: false },
              type: "object",
              format: "grid",
              properties: {
                delayBetweenMessages: {
                  type: "number",
                  title: "Seconds for each message section",                  
                },
                delayBeforePlayMode: {
                  type: "number",
                  title: "Seconds before play mode"
                },
                delayWhenPlaying: {
                  type: "number",
                  title: "Seconds on each screen when playing",
                  description: "Allow enough time for every message section to display!"
                }
              }
            }
          }
        },
        form: [
          {
            key: "messageSections",
            type: "tabarray",
            notitle: true,
            items: [{
              type: "section",
              legend: "{{value}}",
              items: [{
                "key": "messageSections[].name",
                "valueInLegend": true
              }, {
                key: "messageSections[].messages",
                type: "array",
                items: [{
                  "type": "fieldset",
                  htmlClass: "message",
                  items: ["messageSections[].messages[].text"]
                }]
              }]
            }]
          },
          { key: "timing" },
        ],
        value: <?php echo file_get_contents('../../../prefs.json'); ?>,
        onSubmit: function (errors, values) {
          if (errors) {
            $('#res').html('<p>I beg your pardon?</p>');
          }
          else {
            $('#res').html('<p>Hello ' + values.name + '.' +
              (values.age ? '<br/>You are ' + values.age + '.' : '') +
              '</p>');
          }
        }
      });
    </script>
  </body>
</html>