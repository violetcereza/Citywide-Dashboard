<?php

require("config.php");
if (logged_in()) {
  header("Location: ./index.php");
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

    <div style="max-width: 500px; margin: 0 auto;">
      <h2>Log In</h2>
      <form class="form-horizontal" method="post" >
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
