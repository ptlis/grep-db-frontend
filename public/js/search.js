
(function () {
    "use strict";

    // Setup event handler
    $(document).ready(function () {

        // Seed databases
        $('[data-seed-db-target]').each(function () {
            var targetName = $(this).attr('data-seed-db-target');

            $(this).on(
                'click',
                function() {
                    seedDatabases(targetName);
                }
            )
        });

        var $tableSelect = $('[data-seed-table-target]');

        // Init multi-select js
        $tableSelect.multiSelect();

        // Seed tables on database selection
        $tableSelect.each(function () {
            var targetName = $(this).attr('data-seed-table-target');

            // Seed tables on database selection
            $('#' + targetName + '__database').on(
                'change',
                function () {
                    seedTables(targetName);
                }
            );

            // Clear tables on database refresh
            $('[data-seed-db-target="' + targetName + '"]').on(
                'click',
                function () {
                    clearTableSelection(targetName);
                }
            );

            // Update search enabled on keypress in search terms input
            $('#' + targetName + '__search_term').on(
                'keyup',
                function () {
                    updateSearchEnabled(targetName);
                }
            );
        });
    });

    function getCredentials(targetName) {
        return {
            user: $('#' + targetName + '__user').val(),
            password: $('#' + targetName + '__password').val(),
            host: $('#' + targetName + '__host').val(),
            port: $('#' + targetName + '__port').val()
        };
    }

    function seedTables(targetName) {
        var $tableSelect = $('[data-seed-table-target="' + targetName + '"]');
        var databaseName = $('#' + targetName + '__database').val();

        var params = getCredentials(targetName);
        params.dbname = databaseName;

        $.post('tables.php', params)
            .done(function (response) {
                clearTableSelection(targetName);

                if (response.length) {
                    response.forEach(function (tableName) {
                        $tableSelect.append('<option value="' + tableName + '">' + tableName + '</option>');
                    });
                }

                $tableSelect.multiSelect('refresh');
                $tableSelect.multiSelect('select_all');
                updateSearchEnabled(targetName);
            })
            .fail(function (response) {
                showErrorMessage(targetName, response);
            });
    }

    function seedDatabases(targetName) {
        var params = getCredentials(targetName);
        var $select = $('#' + targetName + '__database');

        // Remove options, set only default message
        $select.empty();
        $select.append('<option disabled selected>Select a database...</option>');

        $.post('databases.php', params)
            .done(function (response) {
                if (response.length) {
                    response.forEach(function (value) {
                        $select.append($('<option value="' + value + '">' + value + '</option>'));
                    });

                    updateSearchEnabled(targetName);
                    showSuccessMessage(targetName, 'Databases have been found.');
                } else {
                    showErrorMessage(targetName, ['No databases found']);
                }
            })
            .fail(function (response) {
                showErrorMessage(targetName, response.responseJSON);
            });
    }

    function showErrorMessage(targetName, errorMessageList) {
        var $alert = $('#' + targetName + '__database_message');

        $alert.removeClass('alert-info');
        $alert.removeClass('alert-success');
        $alert.addClass('alert-danger');
        $alert.empty();
        errorMessageList.forEach(function (errorMessage) {
            $alert.append('<p>' + errorMessage + '</p>');
        });
    }

    function showSuccessMessage(targetName, message) {
        var $alert = $('#' + targetName + '__database_message');

        $alert.removeClass('alert-info');
        $alert.removeClass('alert-danger');
        $alert.addClass('alert-success');
        $alert.empty();
        $alert.append('<p>' + message + '</p>');
    }

    function updateSearchEnabled(targetName) {
        var searchTerms = $('#' + targetName + '__search_term').val();
        var databaseName = $('#' + targetName + '__database').val();
        var tables = $('#' + targetName + '__tables').val();

        if (
            searchTerms && searchTerms.length
            && databaseName && databaseName.length
            && tables && tables.length
        ) {
            enableSearch(targetName);
        } else {
            disableSearch(targetName);
        }
    }

    function enableSearch(targetName) {
        $('#' + targetName + '__search_button')
             .removeClass('disabled');
    }

    function disableSearch(targetName) {
        $('#' + targetName + '__search_button')
            .addClass('disabled');
    }

    function clearTableSelection(targetName) {
        var $tableSelect = $('[data-seed-table-target="' + targetName + '"]');
        $tableSelect.empty();
        $tableSelect.multiSelect('refresh');
    }
})();
