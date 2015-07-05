<?php
  require("config.php");
  ini_set('display_errors',1);
  ini_set('display_startup_errors',1);
  error_reporting(-1);
  
  if (logged_in()) {
  	if (file_put_contents('prefs.json', $_POST['data'])) {
  		print_r($_POST['data']);
  	} else {
  	    header('HTTP/1.1 500 Internal Server Error');
  	    header('Content-Type: text; charset=UTF-8');
  	    die('Oops something happened sry.');
  	}
  } else {
    header('HTTP/1.1 401 Forbidden');
    header('Content-Type: text; charset=UTF-8');
    die('Wrong username/password');
  }
?>