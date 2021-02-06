<?php
require 'db.php'; // подгружаем RedBeanPHP
$data = $_POST;

// отображение характеристик для переменной
function dump($what){
  echo '<pre>';
  print_r($what);
  echo '</pre>';
}

// шаюлон для записи
function html($t){
  ?>
  <div class="show-control" id="<?php echo $t->id ?>">
    <form class="add-task" action="" method="POST" data-id="<?php echo $t->id ?>">
      <div class="select">
        <i class="fas fa-check"></i>
      </div>
      <div tabindex="1" class="case<?php if ($t->perform): ?> perform<?php endif; ?>" id="text" name="task" data-day="<?php echo $t->day_of_week ?>">
        <div class="case-text" contenteditable="true" aria-multiline="true" role="textbox" id="text-case">
          <?php echo $t->task_text ?>
        </div>
        <div class="focus-in-input"></div>
        <input id="time-mask" contenteditable="false" cursor="default" tabindex="2" class="time" value="<?php echo $t->time ?>" placeholder="Время"></input>
      </div>
      <!-- <div contenteditable="true" class="case<?php if ($t->perform): ?> perform<?php endif; ?>" id="text" name="task"></div> -->
      <i class="fas fa-ellipsis-v" style="opacity: 0"></i>
      <div class="settings animated faster">
        <div class="scale-btn btn settings-delete" data-id="<?php echo $t->id ?>">Удалить заметку</div>
        <?php if (!$t->perform): ?>
          <div class="scale-btn btn settings-perform" data-id="<?php echo $t->id ?>">Отметить выполненным</div>
        <?php endif; ?>
        <div class="change-day btn">
          Изменить день
          <ul class="settings-change-day" data-id="<?php echo $t->id ?>">
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
    </form>
  </div>
  <?php
}


// функция отображения записи
function show_tasks($name_of_day){
  $tasks = R::findLike('tasks', array(
    'day_of_week' => $name_of_day
  ), 'ORDER BY "id" DESC' );
  foreach ($tasks as $task) {
    html($task);
  }
}

$arr_id = array();
if(isset($data['action']) && !empty($data['action'])) {
  $action = $data['action'];
  switch($action) {
    case 'arr_id' :
    array_push($arr_id, $data['id_of_arr']);
    echo $arr_id[0];
    break;
    case 'send' : send($data['day_send'], $data['text_send'], $data['time_send']); break;
    case 'perform' : perform($data['id_perform'], $data['is_json']); break;
    case 'some_perform' : perform($data['arr_id'], $data['is_json']); break;
    case 'delete' : delete_task($data['id_delete'], $data['is_json']); break;
    case 'delete_some_task' : delete_task($data['arr_id_delete'], $data['is_json']); break;
    case 'update' : update_task($data['id_update'], $data['text_update'], $data['time_update']); break;
    case 'change_day' : change_day($data['id_day'], $data['clicked_day'], $data['is_json']); break;
    case 'some_change_day' : change_day($data['arr_day_id'], $data['clicked_day'], $data['is_json']); break;
    case 'push' : push($data['text_day']); break;
  }
}

// функция отправки при создании новой записи
function send($day, $text, $time){
  $errors = array(); // массив с ошибками

  if ( trim($text) == '' ) {
    $errors[] = 'Введите задачу!';
    echo $text;
  }

  if ( trim($time) == '' ) {
    $errors[] = 'Введите время выполнения!';
    echo $time;
  }

  if ( empty($errors) ) {
    // создаём базу данных и добавляем поля
    $task = R::dispense('tasks');
    $task->day_of_week = $day;
    $task->task_text = trim($text);
    $task->perform = 0;
    $task->time = $time;
    R::store($task);
    html($task);
  } else {
    // выводим ошибки
    echo trim(array_shift($errors));
  }
}

function json_to_arr($id){
  $chars = ['[', ']', '"']; // символы для удаления
  $id = str_replace($chars, '', json_encode($id));  // удаляем символы
  $array_id = explode(',', $id); // приводим строку к массиву
  return $array_id;
}

// отметить выполненным и внести изменения в БД
function perform($id, $is_json){
  $perform = R::findLike('tasks', array(
    'id' => ($is_json) ? json_to_arr($id) : $id
  ), 'ORDER BY "day_of_week" ASC' );
  foreach ($perform as $p) {
    $p->perform = 1;
  }
  R::storeAll($perform);
}

// удалить задачу
function delete_task($id, $is_json){
  $trash_task = R::findLike('tasks', array(
    'id' => ($is_json) ? json_to_arr($id) : $id
  ), 'ORDER BY "day_of_week" ASC' );
  R::trashAll($trash_task);
}

// добавить текст в существующую задачу
function update_task($id, $data_task, $time){
  $update_task = R::findLike('tasks', array(
    'id' => $id
  ), 'ORDER BY "day_of_week" ASC' );
  foreach ($update_task as $update) {
    $update->task_text = trim($data_task);
    $update->time = trim($time);
  }
  R::storeAll($update_task);
}

// смена дня
function change_day($id, $day, $is_json){
  $change = R::findLike('tasks', array(
    'id' => ($is_json) ? json_to_arr($id) : $id
  ), 'ORDER BY "day_of_week" ASC' );
  foreach ($change as $c) {
    $c->day_of_week = $day;
  }
  R::storeAll($change);
}

$asd = 0;

// функция отправки текста задачи в файл
function send_message($t, $data, $tester){
  // $tester++;
  echo $data;
  echo "i = " . $tester;
  // sleep(0.9);
  echo "text = " . $t;
  // записываем текст заметки в файл
  $fp = fopen('electron/task.txt', 'wt');
  $test = fwrite($fp, $t);
  if (!$test) {
    ?> <script>alert("error")</script> <?php
  }
  fclose($fp);

  system("npm config set scripts-prepend-node-path true");
  system("start hide_cmd.vbs");
}

// уведомления
function push($today_day){
  $push = R::findLike('tasks', array(
    'day_of_week' => $today_day
  ), 'ORDER BY "id" DESC' );

  foreach ($push as $p) {
    $text = $p->task_text; // берём текст задачи
    $start_time = substr($p->time, 0, 5); // берём первые 5 символов
    $end_time = substr($p->time, -2);
    $end_hour_time = substr($p->time, 8, -3);
    $end_all_time = substr($p->time, 8, 13);

    if (date("H:i:s") == $end_all_time . ':00' && ($text == "перерыв" || $text == "отдых")) { // если время подошло к концу и задача не выполнена
      $p->perform = 1; // отмечаем выполненной
      R::storeAll($push); // и записывем данные
      send_message($text . " закончен", $p->id);
    } else if (date("H:i:s") == $end_all_time . ':00' && $p->perform != 1) { // если текст задачи перерыв или отдых
      send_message("Время закончилось", -1);
    } else if (date("H:i:s") == $start_time . ':00') { // сообщение о начале выполнения
      send_message($text, -1, $asd);
    } else if (date("H:i:s") == $end_all_time . ':00' && $p->perform == 1) { // сообщение о начале выполнения
      send_message("Молодец!<br>Ты вполнил: " . $text, -1);
    }
  }
}
?>
