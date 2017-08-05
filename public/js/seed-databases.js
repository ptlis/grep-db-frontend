
// Seed a database list dropdown
(function () {
    "use strict";

    // Setup event handler
    $(document).ready(function () {
        $('[data-seed-target]').each(function (index) {
            $(this).on(
                'click',
                seedDatabases
            )
        });
    });

    function seedDatabases() {
        var seedTarget = $(this).attr('data-seed-target');
        var params = {
            user: $('#' + seedTarget + '__user').val(),
            password: $('#' + seedTarget + '__password').val(),
            host: $('#' + seedTarget + '__host').val(),
            port: $('#' + seedTarget + '__port').val()
        };
        var $alertElement = $('#' + seedTarget + '__database_message');

        $.post('databases.php', params)
            .done(function (response) {
                var $select = $('#' + seedTarget + '__database');

                if (response.length) {
                    $select.empty();
                    $select.append('<option disabled>Select a database...</option>');
                    response.forEach(function (value) {
                        $select.append($('<option value="' + value + '">' + value + '</option>'));
                    });

                    $alertElement.removeClass('alert-info');
                    $alertElement.removeClass('alert-danger');
                    $alertElement.addClass('alert-success');
                    $alertElement.empty();
                    $alertElement.append('<p>Databases have been found.</p>');
                } else {
                    $alertElement.removeClass('alert-info');
                    $alertElement.removeClass('alert-success');
                    $alertElement.addClass('alert-danger');
                    $alertElement.empty();
                    $alertElement.append('<p>No databases found.</p>');
                }
            })
            .fail(function (response, wat) {
                $alertElement.removeClass('alert-info');
                $alertElement.removeClass('alert-success');
                $alertElement.addClass('alert-danger');
                $alertElement.empty();

                response.responseJSON.forEach(function (errorMessage) {
                    $alertElement.append('<p>' + errorMessage + '</p>');
                });
            });
        console.log(params);
    }
})();

