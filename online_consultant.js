/**
 * Created by user on 29.03.16.
 */
ocmFailCounter = 0;
ocm_status=0;
ocm_main_position_x=  200;
ocm_main_position_y=  300;
ocm_messages_counter=-1;
$(function () {

    $(".online_consultant_main").draggable({cursor: "move", stop: function(event, ui){
        var x = ($('.online_consultant_main').offset().left);
        var y = ($('.online_consultant_main').offset().top);

        var window_height= $(window).height();
        var window_width= $(window).width();
        var w= 303;
        var h= 424;
        var right_pos= window_width- x- w;
        var bottom_pos= window_height- y- h;
        $.cookie('ocm_main_position_x', right_pos);
        $.cookie('ocm_main_position_y', bottom_pos);
    }});

    ocm_status = $.cookie('ocm_status');
    if (typeof ocm_status === "undefined") {
        $.cookie('ocm_status', 1); // положение по умолчанию- показывается боковой tab
        ocm_status = 1;
    }
    var show_once= $.cookie('show_once');
    if (typeof show_once === "undefined") {// проверяем, есть ли такие куки у браузера
        setTimeout(function(){
            //а тут мы добавим механизм автоматического открывания окна через 60с
            $.cookie('show_once', 1, { expires: 365 });
            ocm_showMain();
        }, 60000);
    }


    var ocm_main_position_x= $.cookie('ocm_main_position_x');
    if (typeof ocm_main_position_x === "undefined") {
        $.cookie('ocm_main_position_x', 10);
        ocm_main_position_x=  10;
    }

    var ocm_main_position_y= $.cookie('ocm_main_position_y');
    if (typeof ocm_main_position_y === "undefined") {
        $.cookie('ocm_main_position_y', 10);
        ocm_main_position_y=  10;
    }
    $('.online_consultant_main').css({right:parseInt(ocm_main_position_x), bottom:parseInt(ocm_main_position_y)});


    if (ocm_status == 0) {
        ocm_showTabMin();
    }
    if (ocm_status == 1) {
        ocm_showTab();
    }
    if (ocm_status == 2) {
        ocm_showMain();
    }



    $('.o_c_m_hide_tab_button').click(function () {
        ocm_showTabMin();
    });

    $('.online_consultant_tab_side_min').click(function () {
        ocm_showTab();
    });

    $(".o_c_m_show_main_button").click(function () {
        ocm_showMain();
    });

    $('#hide_o_c_m_main').click(function () {
        ocm_showTab();
    });

    $("#o_c_m_sendMsg").click(function () {
        var message = $("#o_c_m_textArea").val();
        if (message != "") {
            //console.log("Отправить сообщение", message);
            ocmLoadDialogs(message);
            $("#o_c_m_textArea").val("");

        }
    });

    $("#o_c_m_textArea").enterKey(function () {
        var message = $("#o_c_m_textArea").val();
        if (message != "") {
            //console.log("Отправить сообщение", message);
            ocmLoadDialogs(message);
            $("#o_c_m_textArea").val("");

        }
    });


    setInterval(function () {
        if (ocm_status == 2 && ocmFailCounter < 4) {
            ocmLoadDialogs("");
        }
    }, 3000);

});

function ocmLoadDialogs(msg) {
    $.ajax({
        type: "POST",// GET in place of POST
        contentType: "application/json; charset=utf-8",
        url: "/userapi/online_consultant",
        data: JSON.stringify({msg: msg, token: csrf_token2}),
        dataType: "json",
        success: function (result) {

            if(ocm_messages_counter!= result.length){
                ocm_public_messages(result);
            }

            ocm_messages_counter= result.length;
        },
        error: function () {
            // window.alert("something wrong!");
            ocmFailCounter += 1;
        }
    });
}

$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
};


function ocm_public_messages(result){
    $("#o_c_m_msgList").html("");
    $("#o_c_m_msgList").append("<li class=\"o_c_m_manager_say\">Здравствуйте, мы готовы вам помочь. Можете задать свой вопрос.</li>");
    for (var i in result) {
        var item = result[i];
        if (item.user_say) {
            $("#o_c_m_msgList").append("<li class=\"o_c_m_you_say\">" + item.message + "</li>");
        } else {
            $("#o_c_m_msgList").append("<li class=\"o_c_m_manager_say\">" + item.message + "</li>");
        }
    }

        $(".o_c_m_message_area").scrollTop(100000);
}

function ocm_showMain(){
    $('.online_consultant_tab_side_min').hide();
    $('.online_consultant_tab_side').hide("fast");
    $('.online_consultant_main').show("fast");
    $.cookie('ocm_status', 2);
    ocm_status = 2;
    ocmLoadDialogs("");
    $(".o_c_m_message_area").scrollTop(100000);
};

function ocm_showTab(){
    $('.online_consultant_tab_side_min').hide("fast");
    $('.online_consultant_tab_side').show("fast");
    $('.online_consultant_main').hide("fast");
    $.cookie('ocm_status', 1);
    ocm_status = 1;
};

function ocm_showTabMin(){

    $('.online_consultant_tab_side_min').show("fast");
    $('.online_consultant_tab_side').hide("fast");
    $.cookie('ocm_status', 0);
    ocm_status = 0;
};
