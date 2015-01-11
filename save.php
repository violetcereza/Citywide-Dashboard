<?php
  require("config.php");
  session_start();
  
  if (logged_in()) {
    print_r($_POST['data']);
    file_put_contents('prefs.json', $_POST['data']);
  } else {
    header('HTTP/1.1 401 Forbidden');
    header('Content-Type: text; charset=UTF-8');
    die('Wrong username/password');
  }
?>