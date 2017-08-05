
// Seed a table list multi-select
(function () {
    "use strict";

    // Setup event handler
    $(document).ready(function () {

        var $tableSelect = $('[data-seed-table-target]');

        // Init multi-select js
        $tableSelect.multiSelect();

        // Add table seeding on database selection
        $tableSelect.each(function () {
            var seedTargetName = $(this).attr('data-seed-table-target');

            $('#' + seedTargetName + '__database').on(
                'change',
                getSeedTablesCallback(seedTargetName)
            );
        });
    });

    function getSeedTablesCallback(seedTargetName) {
        return function seedTarget() {

            var $tableSelect = $('[data-seed-table-target="' + seedTargetName + '"]');
            var databaseName = $('#' + seedTargetName + '__database').val();

            var params = {
                user: $('#' + seedTargetName + '__user').val(),
                password: $('#' + seedTargetName + '__password').val(),
                host: $('#' + seedTargetName + '__host').val(),
                port: $('#' + seedTargetName + '__port').val(),
                dbname: databaseName
            };

            $.post('tables.php', params)
                .done(function (response) {
                    $tableSelect.empty();

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
        };
    }
})();
