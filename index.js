(function () {
    let myjson;

    _connectionSetup();
    _setupActionMenu();
    _setupTableRecords();

    let isOpen = false;

    function _connectionSetup() {
        $.ajax({
            async: false,
            url: 'https://raw.githubusercontent.com/Rahmo/miGustaDinosaur/master/SpringCMUIExercise.json',
            dataType: "json",
            success: function (data) {
                myjson = data
            }
        });
    }
    const defaultJson = Object.assign({}, myjson);

    function _setupActionMenu() {
        $.getJSON("https://raw.githubusercontent.com/Rahmo/miGustaDinosaur/master/SpringCMUIExercise.json", function (json) {
            json['Actions'].forEach((item) => {
                    let iconPath = `assets/icons/${item.Name.toLowerCase().replace(' ', '')}.png`;
                    let htmlLink = '';
                    if (item.Name == 'Upload') {
                        htmlLink = '<a class="post" ><img class="icon" onclick="postHandler()" src= ' + iconPath + '></a>'
                    } else {
                        htmlLink = '<a><img class="icon " src= ' + iconPath + '></a>'
                    }
                    $('#scene').append(htmlLink)
                }
            )
        });
    }

    function _setupTableRecords(isRerender = false) {

        //clear table
        if (isRerender){
            for(let i = 0 ; i < myjson['GridData'].length ; i++){
                $('.row').remove();
            }
        }
        myjson['GridData'].forEach((item) => {
                let iconPath;
                if (item['Type'] == 'Folder') {
                    iconPath = `assets/icons/folder.png`;
                } else {
                    iconPath = `assets/icons/document.png`;
                }
                var t = `<tr data-tag = '${item['Name']}' class="row"> <td> <img class="small-icon " src= ${iconPath}>  <span class="name">${item['Name']}</span></td>\n` +
                    `        <td>${item['Description']}</td>\n` +
                    `        <td>${item['ModifiedDate']}</td>\n` +
                    `        <td>${(item['Children']) ? item['Children'].length : ''}</td>\n` +
                    `        <td><input name=\'selection\' type="checkbox"  value="${item['Name']}" /></td></tr>`;

                $('tbody').append(t);
            }
        )
    }

    //used to stop the TR selection event to fire when selecting the checkbox
    $("input").click(function (event) {
        event.stopImmediatePropagation();
    });

    /* Events */
    $('.closed-toggle').click(function (e) {
        if (isOpen == false) {
            $('#scene').removeClass("normal");
            $('#scene').addClass("grow");
            $('.closed-toggle').addClass("open-toggle");
            $(".icon-expand").attr("src", "assets/icons/arrow-right.png");
            isOpen = true;
        } else {
            $('#scene').removeClass("grow");
            $('#scene').addClass("normal");
            $(".closed-toggle").removeClass('open-toggle');
            $(".icon-expand").attr("src", "assets/icons/arrow-left.png");
            isOpen = false;
        }
    });

    this.postHandler = function () {
        var selected = [];
        $.each($("input[name='selection']:checked"), function () {
            selected.push($(this).val());
        });

        alert("You have selected: " + selected.join(", "));
    };

    $('thead').on('click', '.btn-name-filter', function (e){
        if (e.target.value =='true'){
            $(".btn-name-filter").prop('value', 'false');
            $('.btn-name-filter').text('^');
            myjson['GridData'] = defaultJson['GridData'];
        }
        else {
            $(".btn-name-filter").prop('value', 'true');
            $('.btn-name-filter').text('v');
            myjson['GridData'] =_.sortBy(myjson['GridData'], 'Name');
        }
        _setupTableRecords(true);
    });

    $('thead').on('click', '.btn-date-filter', function (e){
        if (e.target.value =='true'){
            $(".btn-date-filter").prop('value', 'false');
            $('.btn-date-filter').text('^');
            myjson['GridData'] =  defaultJson['GridData'].sort((d1, d2) => new Date(d1.ModifiedDate).getTime() > new Date(d2.ModifiedDate).getTime());
        }
        else {
            $(".btn-date-filter").prop('value', 'true');
            $('.btn-date-filter').text('v');

            myjson['GridData'] =  defaultJson['GridData'].sort((d1, d2) => new Date(d1.ModifiedDate).getTime() - new Date(d2.ModifiedDate).getTime());
        }
        _setupTableRecords(true);
    });

    //propagate up to Table on .row
    $('table').on('click', '.row', function (e) {
        let type = e.currentTarget.attributes.getNamedItem('data-tag').value;
        childrenArray = myjson['GridData'].filter(item => item.Name == type)[0]['Children'];
        if (childrenArray.length == 0) {
            alert('this item has no sub items');
        }
        let isOpen = (e.currentTarget.className.includes('open-row'));
        if (isOpen) {
            $('.child-row').remove();
            e.currentTarget.className = 'row';
        } else {
            e.currentTarget.className = 'row open-row';
            childrenArray.forEach(item => {
                var t = `<tr data-tag = '${item['Name']}' class="child-row"> <td> <span >${item['Name']}</span></td>\n` +
                    `        <td>${item['Description']}</td>\n` +
                    `        <td>${item['ModifiedDate']}</td>\n` +
                    `        <td></td>\n` +
                    `        <td><input name=\'selection\' type="checkbox" value="${item['Name']}" /></td></tr>`;

                $(t).insertAfter($(this).closest('tr'));
            });
        }
    });
})();
