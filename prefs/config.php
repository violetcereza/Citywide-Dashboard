<?php
session_start();
/**
 * These are the login details
 */  
define("USERNAME", "dashboard");    // The database username. 
define("PASSWORD", hash('sha512', "walleyandflash"));    // The database password. 
define("USERBROWSER", $_SERVER['HTTP_USER_AGENT']);    // The database password. 

function logged_in() {
  
  if (isset($_GET['logout'])) {
    session_unset();
  }
  
  if (isset($_SESSION['username'], $_SESSION['login_string'])) {
    $login_string = $_SESSION['login_string'];
    $username = $_SESSION['username'];
        
    $login_check = hash('sha512', PASSWORD . USERBROWSER);
    
    if ($login_check == $login_string) {
        return true;
    }
  }
  
  // Try log in from $_POST
  if (isset($_POST['username'], $_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    if ($username == USERNAME && hash('sha512', $password) == PASSWORD) {
      $_SESSION['username'] = $username;
      $_SESSION['login_string'] = hash('sha512', PASSWORD . USERBROWSER);
      return true;
    }
  }
  return false;
}

?>