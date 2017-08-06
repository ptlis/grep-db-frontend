
(function () {
    "use strict";

    // Setup event handler
    $(document).ready(function () {

        // Seed databases
        $('[data-seed-db-target]').each(function () {
            $(this).on(
                'click',
                function() {
                    seedDatabases($(this).attr('data-seed-db-target'));
                }
            )
        });

        var $tableSelect = $('[data-seed-table-target]');

        // Init multi-select js
        $tableSelect.multiSelect();

        // Seed tables on database selection
        $tableSelect.each(function () {
            var seedTargetName = $(this).attr('data-seed-table-target');

            $('#' + seedTargetName + '__database').on(
                'change',
                function () {
                    seedTables(seedTargetName);
                }
            );

            $('[data-seed-db-target="' + seedTargetName + '"]').on(
                'click',
                function () {
                    clearTableSelection(seedTargetName);
                }
            )
        });
    });

    function getCredentials(seedTargetName) {
        return {
            user: $('#' + seedTargetName + '__user').val(),
            password: $('#' + seedTargetName + '__password').val(),
            host: $('#' + seedTargetName + '__host').val(),
            port: $('#' + seedTargetName + '__port').val()
        };
    }

    function seedTables(seedTargetName) {
        var $tableSelect = $('[data-seed-table-target="' + seedTargetName + '"]');
        var databaseName = $('#' + seedTargetName + '__database').val();

        var params = getCredentials(seedTargetName);
        params.dbname = databaseName;

        $.post('tables.php', params)
            .done(function (response) {
                clearTableSelection(seedTargetName);

                if (response.length) {
                    response.forEach(function (tableName) {
                        $tableSelect.append('<option value="' + tableName + '">' + tableName + '</option>');
                    });
                }

                $tableSelect.multiSelect('refresh');
                $tableSelect.multiSelect('select_all');
            })
            .fail(function (response, wat) {
                console.log('error');
            });
    }

    function seedDatabases(seedTargetName) {
        var params = getCredentials(seedTargetName);
        var $select = $('#' + seedTargetName + '__database');

        // Remove options, set only default message
        $select.empty();
        $select.append('<option disabled selected>Select a database...</option>');

        $.post('databases.php', params)
            .done(function (response) {
                if (response.length) {
                    response.forEach(function (value) {
                        $select.append($('<option value="' + value + '">' + value + '</option>'));
                    });

                    showSuccessMessage(seedTargetName, 'Databases have been found.');
                } else {
                    showErrorMessage(seedTargetName, ['No databases found']);
                }
            })
            .fail(function (response) {
                showErrorMessage(seedTargetName, response.responseJSON);
            });
    }

    function showErrorMessage(seedTargetName, errorMessageList) {
        var $alert = $('#' + seedTargetName + '__database_message');

        $alert.removeClass('alert-info');
        $alert.removeClass('alert-success');
        $alert.addClass('alert-danger');
        $alert.empty();
        errorMessageList.forEach(function (errorMessage) {
            $alert.append('<p>' + errorMessage + '</p>');
        });
    }

    function showSuccessMessage(seedTargetName, message) {
        var $alert = $('#' + seedTargetName + '__database_message');

        $alert.removeClass('alert-info');
        $alert.removeClass('alert-danger');
        $alert.addClass('alert-success');
        $alert.empty();
        $alert.append('<p>' + message + '</p>');
    }

    function updateSearchEnabled(seedTargetName) {
        var searchTerms = $('#' + seedTargetName + '__search_term').val();
    }

    function enableSearch(seedTargetName) {
        $('#' + seedTargetName + '__search_button')
             .removeClass('disabled');
    }

    function disableSearch(seedTargetName) {
        $('#' + seedTargetName + '__search_button')
            .addClass('disabled');
    }

    function clearTableSelection(seedTargetName) {
        var $tableSelect = $('[data-seed-table-target="' + seedTargetName + '"]');
        $tableSelect.empty();
        $tableSelect.multiSelect('refresh');
    }
})();
