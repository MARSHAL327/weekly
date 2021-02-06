<?php
require 'functions.php';
$data = $_POST;
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Weekly</title>

  <!-- css -->
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/animate.css">
   <link href="libs/css/all.css" rel="stylesheet">
  <!-- <link rel="stylesheet" href="libs/fontawesome.css"> -->
  <link rel="stylesheet" href="https://unpkg.com/tippy.js@4/themes/light-border.css">
  <!-- scripts -->
  <script src="libs/jquery-3.4.0.min.js"></script>
  <script src="libs/popper.js"></script>
  <script src="libs/tippy.js"></script>
</head>
<body>
  <!-- <script>
  window.$ = window.jQuery = require("jquery");
  </script> -->
  <div class="wrapper-days">
    <div class="bar-selected animated faster" id="selected-bar">
      <div class="close-bar-selected" >
        <i class="fas fa-times" data-tippy-content="Отменить выбор"></i>
      </div>
      <div class="count-selected">Выбрана 1 заметка</div>
      <div class="perform-bar-selected">
        <i class="fas fa-check" data-tippy-content="Отметить выполненными"></i>
      </div>
      <div class="delete-bar-selected">
        <i class="fas fa-trash-alt" data-tippy-content="Удалить заметки"></i>
      </div>
      <div class="settings-bar-selected">
        <i class="fas fa-ellipsis-v" data-tippy-content="Ещё"></i>
        <div class="settings animated faster">
          <div class="change-day btn">
            Изменить день
            <ul class="settings-change-day" data-id="<?php echo $task->id ?>">
              <li class="scale-btn btn">Понедельник</li>
              <li class="scale-btn btn">Вторник</li>
              <li class="scale-btn btn">Среда</li>
              <li class="scale-btn btn">Четверг</li>
              <li class="scale-btn btn">Пятница</li>
              <li class="scale-btn btn">Суббота</li>
              <li class="scale-btn btn">Воскресенье</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="close-bar"></div>
    <div class="tabs">
      <ul>
        <li class="scale-btn btn" id="mon"><div class="day">Понедельник</div>
          <div class="turn-day" style="visibility: hidden">+</div>
        </li>
        <li class="scale-btn btn" id="tue">
          <div class="day">Вторник</div>
          <div class="turn-day" style="visibility: hidden">+</div>
        </li>
        <li class="scale-btn btn" id="wed">
          <div class="day">Среда</div>
          <div class="turn-day" style="visibility: hidden">+</div>
        </li>
        <li class="scale-btn btn" id="thu">
          <div class="day">Четверг</div>
          <div class="turn-day" style="visibility: hidden">+</div>
        </li>
        <li class="scale-btn btn" id="fri">
          <div class="day">Пятница</div>
          <div class="turn-day" style="visibility: hidden">+</div>
        </li>
        <li class="scale-btn btn" id="sat">
          <div class="day">Суббота</div>
          <div class="turn-day" style="visibility: hidden">+</div>
        </li>
        <li class="scale-btn btn" id="sun">
          <div class="day">Воскресенье</div>
          <div class="turn-day" style="visibility: hidden">+</div>
        </li>
        <li class="scale-btn btn" id="all-days"><div class="day">Все дни</div></li>
      </ul>
      <div class="wrapper">
        <div class="grid-day">
          <?php show_tasks('Понедельник'); ?>
          <button id="add-mon" class="plus-task" data-day="Понедельник">+</button>
        </div>
        <div class="grid-day">
          <?php show_tasks('Вторник'); ?>
          <button id="add-tue" class="plus-task" data-day="Вторник">+</button>
        </div>
        <div class="grid-day">
          <?php show_tasks('Среда'); ?>
          <button id="add-wed" class="plus-task" data-day="Среда">+</button>
        </div>
        <div class="grid-day">
          <?php show_tasks('Четверг'); ?>
          <button id="add-thu" class="plus-task" data-day="Четверг">+</button>
        </div>
        <div class="grid-day">
          <?php show_tasks('Пятница'); ?>
          <button id="add-fri" class="plus-task" data-day="Пятница">+</button>
        </div>
        <div class="grid-day">
          <?php show_tasks('Суббота'); ?>
          <button id="add-sat" class="plus-task" data-day="Суббота">+</button>
        </div>
        <div class="grid-day">
          <?php show_tasks('Воскресенье'); ?>
          <button id="add-sun" class="plus-task" data-day="Воскресенье">+</button>
        </div>
        <div class="grid-day">
          <?php
          $all_days = array('Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье');
          show_tasks($all_days);
          ?>
        </div>
      </div>
    </div>
  </div>
  <div class="hot-buttons">
    <div class="hot-button">
      <svg class="ham hamRotate ham8" viewBox="0 0 100 100" width="80">
        <path class="line top" d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959
        -2.727029,8.421573 -7.5,8.421573 h -20" />
        <path class="line middle" d="m 30,50 h 40" />
        <path class="line bottom" d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629
        7.5,-8.634253 7.5,-8.634253 h 20" />
      </svg>
    </div>
    <div class="text-hot-button">Горячие клавиши</div>
  </div>
  <div class="show-hot-button">
    <b>Нажмите на задачу, а затем сочетание клавиш</b><br><br>
    <code>esc</code> - удалить задачу<br><br>
    <code>ctrl+пробел</code> - отметить выполненным<br><br>
    <code>ctrl+B</code> - добавить задачу<br><br>
  </div>
</body>

<!-- js -->
<script src="js/jquery.maskedinput.min.js" charset="utf-8"></script>
<script src="js/index.js" charset="utf-8"></script>
</html>
