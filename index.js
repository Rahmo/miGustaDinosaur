_setupActionMenu();


let isOpen = false;
$('.closed-toggle').click(function() {
    if(isOpen == false) {
        $('#scene').removeClass("normal");
        $('#scene').addClass("grow");
        $('.closed-toggle').addClass("open-toggle");
        $(".menu-icon").attr("src","assets/icons/arrow-right.png");
        isOpen = true;
    } else {
        $('#scene').removeClass("grow");
        $('#scene').addClass("normal");
        $(".closed-toggle").removeClass('open-toggle');
        $(".menu-icon").attr("src","assets/icons/arrow-left.png");
        isOpen = false;
    }
});

function _setupActionMenu() {
    $.getJSON("https://raw.githubusercontent.com/Rahmo/miGustaDinosaur/master/SpringCMUIExercise.json", function(json) {
        console.log();
        json['Actions'].forEach( (item)=>{
                let iconPath = `assets/icons/${item.Name.toLowerCase().replace(' ','')}.png`;
                let htmlLink = '';
                if (item.Name == 'Upload'){
                    htmlLink = '<a class="post"><img class="icon" onclick="postHandler()" src= ' +iconPath + '></a>'
                }else {
                    htmlLink = '<a><img class="icon " src= ' +iconPath + '></a>'
                }
                $('#scene').append(htmlLink)
            }
        )
    });
}

let postHandler = function() {
    var favorite = [];
    console.log('clickkkk');
    $.each($("input[name='selection']:checked"), function () {
        favorite.push($(this).val());
    });

    alert("My favourite sports are: " + favorite.join(", "));
};
