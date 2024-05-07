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
    $('#orders').css('font-weight', '400')
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
    $('#orders').css('font-weight', '400')
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
    $('#orders').css('font-weight', '400')
    $('.content').append(
        `
        <div>newslatter here</div>
        `
    )
})
$('#orders').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '600')
    $('.content').append(
        `
        <div>orders here</div>
        `
    )
})

//existing plants displaying
axios.get('http://localhost:3000/plants')
.then((res)=>{
    console.log(res.data)
    for(let el of res.data){
        $('.plantslist').append(
            `
            <div class="plant">
            <img class="plantImg" src="./imgs/${el.image}" alt="">
            <h3 class="plantName">${el.title}</h3>
            <div class="plantRating">${el.rating}</div>
            <div class="plantPrice">${el.price}</div>
        </div>
            `
        )
    }
})

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

