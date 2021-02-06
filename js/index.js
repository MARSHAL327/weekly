$(document).ready(function(){
  //----------------------------------- функции -----------------------------------

  // ------------------ всплывающие подсказки ------------------
  function show_tippy(){
    tippy('.fa-ellipsis-v', {
      content: "Ещё",
    })
    tippy('.select', {
      content: "Выбрать заметку",
    })
    tippy('.bar-selected ', {
      target: '.fas',
    })
    tippy('.plus-task', {
      content: "Добавить заметку",
      followCursor: true,
      theme: 'light-border',
    })
  }
  // ------------------ конец всплывающих подсказок ------------------

  //----------------------------------- ajax -----------------------------------

  // функция отметки записи выполненной
  function performTask(t){
    if ($('.add-task').hasClass('active')) {
      var id = $('.add-task.active').data('id');
    } else {
      var id = t.data('id');
    }
    $.ajax({
      url: "../functions.php",
      context: $(this),
      type: "POST",
      data: ({id_perform: id, is_json: 0, action: 'perform'}),
      dataType: "HTML",
      success: function(){
        $('.add-task.active').children('.case').addClass('perform');
      }
    });
  }

  // функция удаления записи
  function deleteTask(t) {
    if ($('.add-task').hasClass('active')){
      var id = $('.add-task.active').data('id');
    } else {
      var id = t.data('id');
    }
    $.ajax({
      url: "../functions.php",
      context: $(this),
      type: "POST",
      data: ({id_delete: id, is_json: 0, action: 'delete'}),
      dataType: "HTML",
      success: function(){
        $('#' + id).detach();
      }
    });
  }

  function test() {
    var data = 5;
    $.ajax({
      url: "../index.hta",
      context: $(this),
      type: "GET",
      data: ({d: data}),
      dataType: "HTML",
      success: function(){
        console.log("ok");
      },
      error: function() {
        console.log("error");
      }
    });
  }
  // функция обновления записи
  function updateTask() {
    if ($('.add-task').hasClass('active')) {
      var id = $('.add-task.active').data('id');
      var text = $('.add-task.active').find('.case-text').html();
      var time = $('.add-task.active').find('.time').val();
      $.ajax({
        url: "../functions.php",
        context: $(this),
        type: "POST",
        data: ({id_update: id, text_update: text, time_update: time, action: 'update'}),
        dataType: "HTML",
        success: function(){}
      });
    }
  }

  //----------------------------------- конец ajax -----------------------------------

  // функция отображения кол-ва выбранных заметок
  function show_count_of_selected(cof){
    if (cof == 1) {
      $('.count-selected').text("Выбрана " + cof + " заметка");
    } else if (cof >= 2 && cof <= 4){
      $('.count-selected').text("Выбрано " + cof + " заметки");
    } else if (cof >= 5){
      $('.count-selected').text("Выбрано " + cof + " заметок");
    }
  }

  // -----------убираем найстроки для нескольких записей-----------
  function hide_bar(){
    // отображаем пункт "Ещё"
    $('.case').after('<i class="fas fa-ellipsis-v" style="opacity: 0" tabindex="0"></i>');
    show_tippy();

    $('.close-bar').css('visibility', 'hidden');
    $('.bar-selected').addClass('fadeOutUp');
    $('.wrapper').css("padding-top", "20px");
    count_of_selected = 0;
    console.log(count_of_selected);
    $('.case').removeClass('selected');
    $('.select').css('opacity', '0');
  }

  function short_hide_bar(){
    // отображаем пункт "Ещё"
    $('.case').after('<i class="fas fa-ellipsis-v" style="opacity: 0" tabindex="0"></i>');
    show_tippy();

    $('.close-bar').css('visibility', 'hidden');
    $('.bar-selected').addClass('fadeOutUp');
    $('.wrapper').css("padding-top", "20px");
    count_of_selected = 0;
  }
  //-----------------------------------------

  // перевод дней в европейскую систему
  function getLocalDay() {
    var day = new Date().getDay();
    if (--day == -1) { // день -1 становится 6
      day = 6;
    }
    // return 2;
    return day;
  }

  // шаблон добавления новой записи
  function add_task(t, fl){
    if (fl) {
      var day_of_week = t.data('day');
    } else {
      var number_of_week = $('.tabs li.active').data('page') + 1;
      var day_of_week = t;
      t = $('.grid-day:nth-child('+ number_of_week +')').find('.plus-task');
    }
    t.before(
      `<form class="add-new-task" action="" method="POST">
      <div tabindex="1" class="case" >
      <div class="case-text" contenteditable="true" aria-multiline="true" role="textbox" name="task">
      <br>
      </div>
      <input id="time-mask" contenteditable="false" cursor="default" tabindex="2" class="time" value="" placeholder="Время"></input>
      </div>
      <div class="check first">
      <button type="button" name="send" data-day="`+ day_of_week +`" class="success">
      <i class="fas fa-check"></i>
      </button>
      <button type="button" class="cancel">
      <i class="fas fa-times"></i>
      </button>
      </div>
      </form>`
    );
    $('.case-text').focus();
  }

  // функция установки курсора в конец
  function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
    && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }

  // функция отправки уведоилений
  function pushNotification(dow){
    $.ajax({
      type: "POST",
      url: "../functions.php",
      async: true,
      data: ({action: 'push', text_day: dow}),
      success: function(data){
        if (data > 0) {
          console.log($('#' + data).find('.case').addClass('perform'));
        }
        if (data == -1) {
          // запускаем звук
          console.log("I called!");
        }
        console.log(data);
      }
    });
  }

  // перевод номера дня недели в текст
  function text_day_of_week(){
    switch (getLocalDay()) {
      case 0: return 'Понедельник'; break;
      case 1: return 'Вторник'; break;
      case 2: return 'Среда'; break;
      case 3: return 'Четверг'; break;
      case 4: return 'Пятница'; break;
      case 5: return 'Суббота'; break;
      case 6: return 'Воскресенье'; break;
    }
  }

  //----------------------------------- конец функций -----------------------------------

  var timerId = setTimeout(function tick() {
    pushNotification(text_day_of_week());
    timerId = setTimeout(tick, 1 * 1000);
  }, 2000);

  show_tippy(); // вызываем подсказки

  // удаляем запись
  $(document).on('click', '.settings-delete', function(e){
    deleteTask($(this));
  });

  // отмечяем запись выполненной
  $(document).on('click', '.settings-perform', function(e){
    performTask($(this));
    $('.settings').removeClass('active-settings');
    $(this).detach();
  });

  // горячие клавиши
  $(document).keyup(function(e) {
    if (e.keyCode == 27) { // escape
      deleteTask();
    }

    if (e.ctrlKey && e.keyCode == 32) { // ctrl+space
      performTask();
      $('.settings-perform').detach();
    }
  });

  // отправка в БД при создании записи
  $(document).on('click', '.success[name="send"]', function(e){
    var day = $(this).data('day');
    var text = $(this).parent().prev().children().text();
    var time = $(this).parent().prev().find('.time').val();
    $.ajax({
      url: "../functions.php",
      context: $(this),
      type: "POST",
      data: ({day_send: day, text_send: text, time_send: time, action: 'send'}),
      dataType: "HTML",
      success: function(data){
        if (time != '' && text != '') {
          $(this).parent().prev('.case').parent().next().before(data); // ставим новый шаблон
          $(this).parent().prev('.case').parent().detach(); // удаляем старый шаблон
          show_tippy();
        } else {
          alert(data);
        }
      }
    });
  });


  //----------------------------------- js -----------------------------------

  //-----------события при нажатии на задачу-----------

  //изменяем цвета для времени и ставим маску
  $(document).on('focus', '.time', function(e){

    // маска
    $.mask.definitions['~']='[0-2]';
    $.mask.definitions['*']='[0-9]';
    $.mask.definitions['#']='[0-5]';
    $(".time").mask("~*:#9 - ~*:#9");

    if ($(this).parents('.case').hasClass('perform')) { // еесли задача отмечена выполненной
      $(this).css('background-color', '#fff');
    } else {
      $(this).css({
        'background-color': '#202124',
        'color': '#fff'
      });
    }
  });

  // еесли убрали фокус с времени
  $(document).on('blur', '.time', function(e){
    $(this).css({
      'background-color': 'rgba(224, 224, 224, 0.6)',
      'color': '#000'
    });
  });
  //-----------------------------------------

  // установка курсора в конец
  $(document).on('click', '.focus-in-input', function(e){ // если нажали на задачу
    var result = $(this).find('#text-case');
    var preHtml = result.html();
    result.html(preHtml);
    result.focus();
    placeCaretAtEnd(e.currentTarget.previousElementSibling);
  });

  $(document).on('click', '.add-task', function(e){ // если нажали на задачу
    if (!$(this).children('.case').hasClass('active')) { // если нажали на задачу без класса active

      // запись в БД при нажатии на клавиатуру
      $(document).keyup(function(e){
        updateTask();
      });

      $('.case').removeClass('active'); // убираем active со всех других задач
      $(this).children('.case').addClass('active'); // стилизируем задачу

      // убираем фокус с textarea если нажали вне блока
      $(document).mouseup(function (e){ // событие клика по веб-документу
        var div = $("#text"); // тут указываем ID элемента
        if (!div.is(e.target) && div.has(e.target).length === 0) { // если клик был не по нашему блоку и не по его дочерним элементам
          $('body').css('cursor', 'default');
          $('.add-task').children('.case').css('cursor', 'default');
          $('.add-task').removeClass('active');
          $('.case').removeClass('active');
          $('.show-control').removeClass('active');
          // $(this).children('.case').css('cursor', 'text');
          // $(this).addClass('active');
        }
      });
    }

    if (!$('.add-task').hasClass('active')) {
      $(this).children('.case').css('cursor', 'text');
      $(this).addClass('active');
      $(this).parent().addClass('active');
    } else {
      $('.add-task').children('.case').css('cursor', 'default');
      $('.add-task').removeClass('active');
      $('.show-control').removeClass('active');
      $(this).children('.case').css('cursor', 'text');
      $(this).addClass('active');
    }
  });

  //-----------конец событий при нажатии на задачу-----------


  //-----------события при редактировании нескольких задач-----------

  // основной код
  var count_of_selected = 0; // кол-во выбранных записей
  var array_of_id = []; // массив выбранных записей

  $(document).on('click', '.select', function(e){
    $('.fa-ellipsis-v').detach(); // убираем пункт "Ещё"

    // показываем пункт "Ещё" только в настройках множесвенного выбора
    $('.settings-bar-selected').children().before('<i class="fas fa-ellipsis-v" tabindex="0"></i>');
    show_tippy();

    $('.close-bar').css('visibility', 'visible');
    var textarea = $(this).next('.case');
    if (!textarea.hasClass('selected')) {
      textarea.addClass('selected');
      count_of_selected++;
      show_count_of_selected(count_of_selected); // отображаем кол-во выбранных заметок

      array_of_id.push($(this).parent().data('id'))
    } else {
      var index_array = array_of_id.indexOf($(this).parent().data('id')); // находим индекс удаляемого элемента
      array_of_id.splice(index_array, 1); // удаляем элемент из массива

      // отображаем пункт "Ещё"
      $('.case').after('<i class="fas fa-ellipsis-v" style="opacity: 0" tabindex="0"></i>');
      show_tippy();

      textarea.removeClass('selected');
      count_of_selected--;
      show_count_of_selected(count_of_selected); // отображаем кол-во выбранных заметок
    }

    if (count_of_selected == 0) { // если нет выбранных элементов
      $('.bar-selected').addClass('fadeOutUp'); // убираем найстроки для нескольких записей
      $('.wrapper').css("padding-top", "20px");
      $('.close-bar').css('visibility', 'hidden');
    } else {
      $('.bar-selected').removeClass('fadeOutUp'); // показываем найстроки для нескольких записей
      $('.bar-selected').addClass('fadeInDown');
    }

    if (parseInt($(".wrapper").css("padding-top")) < 60) {
      $('.wrapper').css("padding-top", "+=90px"); // отодвигаем wrapper вниз
    }
  });

  // -------------логика закрытия выбора нескольких задач-------------
  $(document).on('click', '.close-bar-selected', function(e){
    $('.settings').removeClass('active-settings');
    $('.settings').removeClass('fadeInDown_10_percent');
    hide_bar();
  });

  $(document).on('click', '.close-bar', function(e){
    $('.settings').removeClass('active-settings');
    $('.settings').removeClass('fadeInDown_10_percent');
    hide_bar();
  });
  // -------------конец логики закрытия выбора нескольких задач-------------

  // JSON
  $(document).on('click', '.perform-bar-selected', function(e){
    $.post('functions.php',{
      arr_id: JSON.stringify(array_of_id),
      is_json: 1,
      action: 'some_perform'
    },
    function() {
      for (var i = 0; i < array_of_id.length; i++) {
        $('#' + array_of_id[i]).find('.settings-perform').detach();
      }
      $('.selected').addClass('perform');
    });
  });

  $(document).on('click', '.delete-bar-selected', function(e){
    $.post('functions.php',{
      arr_id_delete: JSON.stringify(array_of_id),
      is_json: 1,
      action: 'delete_some_task'
    },
    function() {
      for (var i = 0; i < array_of_id.length; i++) {
        $('#' + array_of_id[i]).detach();
      }
      short_hide_bar();
    });
  });


  //-----------конец событий при редактировании нескольких задач-----------


  //-----------события при наведении на задачу-----------

  // показываем кнопку настроек задачи и кнопку выбора несколких задач
  $(document).on('mouseover', '.add-task', function(e){
    $(this).children('.fa-ellipsis-v').css('opacity', '1');
    $(this).find('.select').css('opacity', '1');
  });

  // скрываем кнопку настроек задачи и кнопку выбора несколких задач
  $(document).on('mouseout', '.add-task', function(e){
    if (!$(this).children('.settings').hasClass('active-settings')) {
      $(this).children('.fa-ellipsis-v').css('opacity', '0');
      if (!$(this).find('.case').hasClass('selected')) {
        $(this).find('.select').css('opacity', '0');
      }
    }
  });

  // показываем настройки задачи
  $(document).on('click', '.fa-ellipsis-v', function(e){

    $('body').css('cursor', 'default');
    $('.add-task').children('.case').css('cursor', 'default');
    $('.add-task').removeClass('active');
    $('.case').removeClass('active');
    $('.show-control').removeClass('active');
    // $(this).prev().removeClass('active');

    $(document).mouseup(function (e){ // событие клика по веб-документу
      var div = $(".settings"); // тут указываем ID элемента
      if (!div.is(e.target) && div.has(e.target).length === 0) { // если клик был не по нашему блоку и не по его дочерним элементам
        div.removeClass('active-settings'); // убираем подпункты
      }
    });

    // формируем расположение элемента
    var width_settings = $(this).next().width();
    if ($(this).parent().hasClass('settings-bar-selected')) {
      $(this).next().toggleClass('active-settings');
      $(this).next().addClass('fadeInDown_10_percent');
      $('.settings').css('right', width_settings - 120); // для нескольких задач
    } else {
      $(this).next().addClass('active-settings');
      $(this).next().addClass('fadeInDown_10_percent');
      $('.settings').css('right', -width_settings + 30); // для одной задачи
    }
    $(this).prev().removeClass('active');
  });

  $(document).on('click', '.settings-change-day .scale-btn', function(e){
    var day_of_week = $(this).text();
    var is_array = 0;

    // логика для нескольких заметок
    if ($(this).parents('.settings').prev().parent().hasClass('settings-bar-selected')) {
      var id = array_of_id;

      // отправляем запрос
      $.post('../functions.php',{
        clicked_day: day_of_week,
        arr_day_id: JSON.stringify(array_of_id),
        action: 'some_change_day',
        is_json: 1
      },
      function(data) {
        for (var i = 0; i < array_of_id.length; i++) {
          $('.plus-task[data-day='+ day_of_week +']').before($('#' + array_of_id[i])); // перемещаем элементы в выбранный день
        }
        hide_bar(); // убираем строку выбора
      });
    } else {
      // логика для одной заметки
      var id = $(this).parent().data('id');

      // отправляем запрос
      $.ajax({
        url: "../functions.php",
        context: $(this),
        type: "POST",
        data: ({clicked_day: day_of_week, id_day: id, is_json: 0, action: 'change_day'}),
        dataType: "HTML",
        success: function(data){
          $('.plus-task[data-day='+ day_of_week +']').before($('#' + id )); // перемещаем элементы в выбранный день
          $('.settings').removeClass('active-settings');
        }
      });
    }
  });


  $(document).on('mouseover', '.change-day', function(e){
    $(this).children().css('visibility', 'visible');
  });

  $(document).on('mouseleave', '.change-day', function(e){
    $(this).children().css('visibility', 'hidden');
  });

  // скрвыаем настройки если нажали вне элемента
  $(document).mouseup(function (e){ // событие клика по веб-документу
    var div = $(".active-settings"); // тут указываем ID элемента
    if (!div.prev().parent().hasClass('settings-bar-selected')) {
      if (!div.is(e.target) && div.has(e.target).length === 0) { // если клик был не по нашему блоку и не по его дочерним элементам
        div.prev().css('opacity', '0');
        div.removeClass('active-settings');
        div.prevAll('.select').css('opacity', '0');
      }
    }
  });

  //-----------конец событий при наведении на задачу-----------


  // скрываем элемент если пользователь нажал на удаление
  $(document).on('click', ".cancel", function() {
    $(this).prev().parent().prev().parent().detach();
  });

  // горячие клавиши
  $(document).on('click', ".hot-buttons", function() {
    $('.show-hot-button').toggleClass('active-hot-button');
    $('.ham').toggleClass('active');
  });

  // tabs
  (function($){
    jQuery.fn.lightTabs = function(options){

      var createTabs = function(){
        tabs = this;
        i = 0;

        showPage = function(i){
          $(tabs).children("div").children("div").hide();
          $(tabs).children("div").children("div").eq(i).show();
          $(tabs).children("ul").children("li").removeClass("active");
          $(tabs).children("ul").children("li").eq(i).addClass("active");
        }

        showPage(getLocalDay()); // ставим active для сегодняшнего дня

        $(tabs).children("ul").children("li").each(function(index, element){
          $(element).attr("data-page", i);
          i++;
        });

        $(tabs).children("ul").children("li").click(function(){
          showPage(parseInt($(this).attr("data-page")));
        });
      };
      return this.each(createTabs);
    };
  })(jQuery);
  $(".tabs").lightTabs();


  //-----------события при создании новой задачи-----------
  // добавление новой записи по горячей клавише
  $(document).keyup(function(e) {
    if (e.ctrlKey && e.keyCode == 66) { // ctrl+b
      add_task($('.tabs li.active .day').text(), 0);
    }
  });

  // добавление новой записи
  $(document).on('click', ".plus-task", function() {
    add_task($(this), 1);
  });
});
//-----------конец событий при создании новой задачи-----------

// самоизменяющийся размер textarea
// $('textarea').keyup(function() {
//   $(this).height(0);
//   $(this).height(this.scrollHeight);
//   console.log($(this).val().length);
//   if ($(this).val().length <= 0) $(this).height(0);
//   console.log("ok");
// });
