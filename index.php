<html>
    <head>
        <title>City-Wide Dashboard</title>
        <style type="text/css" media="screen">
        body {
          margin: 0;
          background: black;
          overflow: hidden;
        }
        #buttons > image {
          cursor: pointer;
        }
        .popup {
          position: absolute;
          background: white;
          font-family: Helvetica;
          max-width: 300px;
          padding: 0.75em;
          font-size: 0.75em;
          border-radius: 5px;
          border: 1px solid #aaa;
          box-shadow: 0 0 3px rgba(0,0,0,0.5);
        }
        .popup h1 {
          font-size: 1em;
          margin: 0;
        }
        .popup p {
          margin: 0.5em 0 0;
        }
        .close {
          position: absolute;
          right: -1px;
          top: -1px;
          width: 24px;
          height: 19px;
          cursor: pointer;
          font-family: 'Futura-Medium', Futura, sans-serif;
          font-weight: bold;
          background: black;
          color:white;
          padding-top: 4px;
          text-align: center;
          border-radius: 0 5px;
        }
        iframe {
          overflow: hidden;
          margin-bottom: 10px;
        }
        #loader {
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          text-align: center;
          background: black;
          color: white;
          font-family: 'Futura-Medium', Futura, sans-serif;
          z-index: 999999;
        }
        #loader span {
          position: absolute;
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
              -ms-transform: translate(-50%, -50%);
                  transform: translate(-50%, -50%);
        }
        </style>
        <script type="text/javascript">
          var prefs = <?php echo file_get_contents('prefs.json'); ?>;
        </script>
        <script src="js/vendor/jquery-1.11.0.min.js" type="text/javascript" charset="utf-8"></script>
        <script src="js/vendor/svg.js" type="text/javascript" charset="utf-8"></script>
        <script src="js/vendor/svg.parser.js-master/svg.parser.min.js" type="text/javascript" charset="utf-8"></script>
        <script src="js/vendor/svg.import.js-master/svg.import.js" type="text/javascript" charset="utf-8"></script>
        <script src="js/vendor/javascript-state-machine-master/state-machine.min.js" type="text/javascript" charset="utf-8"></script>
        <script src="js/vendor/svg.filter.js-master/svg.filter.js" type="text/javascript" charset="utf-8"></script>
        <!--script src="js/vendor/jquery.parse-master/jquery.parse.min.js" type="text/javascript" charset="utf-8"></script-->
        <script src="js/vendor/svg.foreignobject.js-master/svg.foreignobject.js" type="text/javascript" charset="utf-8"></script>
        <script src="js/vendor/moment.min.js" type="text/javascript" charset="utf-8"></script>
        <script src="js/vendor/jquery.transform.js-master/jquery.transform2d.js" type="text/javascript" charset="utf-8"></script>
        <script src="js/main.js" type="text/javascript" charset="utf-8"></script>
    </head>
    <body>
      <div id="loader"><span>The Environmental Dashboard is loading...</span></div>
      <video id="character" src="img/squirrel/neutral.mov" width="183" height="207" autoplay loop></video>
      <div id="gauges">
      </div>
      <div id="svg-container">
      </div>
    </body>
</html>
