$(document).ready(function() {
    var $header = $("#header-wrap");
    $(window).scroll(function(){
        if ( $(this).scrollTop() <= 200){
            $header.removeClass()
        } else if($(this).scrollTop() > 200 && $(this).scrollTop() <= 500) {
            $header.removeClass()
                    .addClass("header-faded")
        } else if($(this).scrollTop() > 500) {
            $header.removeClass()
                    .addClass("header-fixed")
    }});//scroll
    $("#menu-toggle").click(function () {
            $("#mobile-sidebar").addClass("i-active");
            $("#main-overlay").addClass("i-active");
            event.stopPropagation();
        }
    );
    $("#main-overlay").click(function () {
            $("#mobile-sidebar").removeClass("i-active");
            $("#main-overlay").removeClass("i-active");
            event.stopPropagation();
        }
    );
    $("#mobile-exit").click(function () {
            $("#mobile-sidebar").removeClass("i-active");
            $("#main-overlay").removeClass("i-active");
            event.stopPropagation();
        }
    );
    $('.menu-item_lvl-1').click(function(event) {
        $('._opened').removeClass('_opened');
        $(this).addClass('_opened');
    });
    $('.back-link_lvl-1').click(function(event) {
        $('.menu-item_lvl-1').removeClass('_opened');
        return false;
    });
    $('.menu-item_lvl-2').click(function(event) {
        $(this).addClass('_opened');
        return false;
    });
    $('.back-link_lvl-2').click(function(event) {
        $('.menu-item_lvl-2').removeClass('_opened');
        return false;
    });



    const slider = $(".main-slider");
    slider
        .slick({
            dots: true,
            arrows: false,
            dotsClass: 'slick-dots',
            draggable: false,
            verticalSwiping: true,
            speed: 300,
            slidesToShow: 1,
            vertical: true
        });

    slider.on('wheel', (function(e) {
        e.preventDefault();

        if (e.originalEvent.deltaY < 0) {
            $(this).slick('slickPrev');
        } else {
            $(this).slick('slickNext');
        }
    }));




});