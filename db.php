<?php
  require 'libs/rb.php'; // подгружаем RedBeanPHP

  // привязываем к БД
  R::setup( 'mysql:host=localhost;dbname=weekly_bd',
       'root', '' ); //for both mysql or mariaDB
 ?>
