<?php
  if ($_POST['username'] == 'dashboard' && md5($_POST['password']) == 'd72aa949d86845e6c1e2575bc2390152') {
    print_r($_POST['data']);
    file_put_contents('prefs.json', $_POST['data']);
  } else {
    header('HTTP/1.1 401 Forbidden');
    header('Content-Type: text; charset=UTF-8');
    die('Wrong username/password');
  }
?>