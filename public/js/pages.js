
// Enable 'pages' functionality - this is a lightly modified version of the JS that powers the Bootstrap Material Design
// website, see http://fezvrasta.github.io/bootstrap-material-design/
(function () {
    "use strict";


    // Ensure that the first page is selected if none is provided
    $(document).ready(function () {
        var $sideBarList = $('#sidebar_menu li');
        var basePage = $($sideBarList[0]).attr('data-target');

        if (window.location.hash !== basePage) {
            var $page = $('.menu').find('li[data-target="' + basePage + '"]');
            if (window.location.hash !== $page.data('target')) {
                window.location.hash = $page.data('target');
            }
            $page.trigger('click');
        }
    });


    // Handle window resizes
    $(window).on('resize', function () {
        var height = $(window).height();
        $('html, body').height(height);
        $('.main, .menu').height(height - $('.header-panel').outerHeight());
        $('.pages').height(height);
    }).trigger('resize');


    // Switch out active page
    $('.menu li').click(function () {

        // Skip if already on the correct page
        if (!$(this).data('target') || $(this).is('.active')) {
            return;
        }

        window.location.hash = $(this).data('target');

        $('.menu li').removeClass('active');
        $(this).addClass('active');
        $('.page').not(window.location.hash).removeClass('active').hide();



        var page = $(window.location.hash);
        page.show();

        var totop = setInterval(function () {
            $('.pages').animate({scrollTop: 0}, 0);
        }, 1);

        setTimeout(function () {
            page.addClass('active');
            setTimeout(function () {
                clearInterval(totop);
            }, 1000);
        }, 100);
    });
})();
