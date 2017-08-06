
// Seed a database list dropdown
(function () {
    "use strict";

    // Setup event handler
    $(document).ready(function () {
        $('[data-seed-db-target]').each(function (index) {
            $(this).on(
                'click',
                seedDatabases
            )
        });
    });

    function seedDatabases() {
        var seedTarget = $(this).attr('data-seed-db-target');
        var params = {
            user: $('#' + seedTarget + '__user').val(),
            password: $('#' + seedTarget + '__password').val(),
            host: $('#' + seedTarget + '__host').val(),
            port: $('#' + seedTarget + '__port').val()
        };
        var $alert = $('#' + seedTarget + '__database_message');
        var $select = $('#' + seedTarget + '__database');

        // Remove options, set only default message
        $select.empty();
        $select.append('<option disabled selected>Select a database...</option>');

        $.post('databases.php', params)
            .done(function (response) {
                if (response.length) {
                    response.forEach(function (value) {
                        $select.append($('<option value="' + value + '">' + value + '</option>'));
                    });

                    $alert.removeClass('alert-info');
                    $alert.removeClass('alert-danger');
                    $alert.addClass('alert-success');
                    $alert.empty();
                    $alert.append('<p>Databases have been found.</p>');
                } else {
                    $alert.removeClass('alert-info');
                    $alert.removeClass('alert-success');
                    $alert.addClass('alert-danger');
                    $alert.empty();
                    $alert.append('<p>No databases found.</p>');
                }
            })
            .fail(function (response) {
                $alert.removeClass('alert-info');
                $alert.removeClass('alert-success');
                $alert.addClass('alert-danger');
                $alert.empty();

                response.responseJSON.forEach(function (errorMessage) {
                    $alert.append('<p>' + errorMessage + '</p>');
                });
            });
    }
})();

