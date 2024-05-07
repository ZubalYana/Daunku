//theme changing
let theme = localStorage.getItem('theme') || 'light';
$('.theme').click(function(){
    if(theme == 'light'){
        theme = 'dark';
        localStorage.setItem('theme', theme);
        changeTheme(theme);

    }else{
        theme = 'light';
        localStorage.setItem('theme', theme);
        changeTheme(theme);
    }
})
function changeTheme(theme){
    if(theme == 'light'){
        $('.theme').css('justify-content', 'flex-start')
        $('.theme').css('background-color', '#566270')
        $('.theme_circle').css('background-color', '#fff')
        $('.theme_circle').css('border', '2px #566270 solid')

    }else{
        $('.theme').css('justify-content', 'flex-end')
        $('.theme').css('background-color', '#fff')
        $('.theme_circle').css('background-color', '#566270')
        $('.theme_circle').css('border', '2px #fff solid')


    }
}
changeTheme(theme);

//pages changing
$('.content').append(
    `
    <div class="addNewPlantsBtn">+</div>
    <div class="plantslist"></div>
    `
)
$('#plants').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '600')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '400')
    $('#unknownPage').css('font-weight', '400')
    $('.content').append(
        `
        <div class="addNewPlantsBtn">+</div>
        <div class="plantslist"></div>
        `
    )
})
$('#contacts').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '600')
    $('#newslatter').css('font-weight', '400')
    $('#unknownPage').css('font-weight', '400')
    $('.content').append(
        `
        <div>contacts here</div>
        `
    )
})
$('#newslatter').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '600')
    $('#unknownPage').css('font-weight', '400')
    $('.content').append(
        `
        <div>newslatter here</div>
        `
    )
})
$('#unknownPage').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '400')
    $('#unknownPage').css('font-weight', '600')
    $('.content').append(
        `
        <div>unknown page here</div>
        `
    )
})