//plants functionality
let db = [];
axios.get('http://localhost:3000/plants')
.then((res)=>{
    console.log(res.data)
    for(let el of res.data){
        db.push(el)
        $('.plantsContainer').append(
            `
            <div class="plant">
            <div class="plant_imgCon">
                <img class="plant_img" src="./imgs/${el.image}">
                <div class="plant_textCon">
                    <div class="plant_title">${el.title}</div>
                    <div class="plant_rating"></div>
                    <div class="plant_PriceAddCon">
                        <div class="plant_price">$${el.price}.00</div>
                        <div class="plant_addBtn" id="${el._id}">+</div>
                    </div>
                </div>
            </div>
        </div>
            `
        )
        if(el.rating == 5){
            $('.plant_rating').empty();
            $('.plant_rating').append(
                `<i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>`
            )
        }else if(el.rating == 4){
            $('.plant_rating').empty();
            $('.plant_rating').append(
                `<i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>`
            )
        }else if(el.rating == 3){
            $('.plant_rating').empty();
            $('.plant_rating').append(
                `<i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>
                <i class="fa-regular fa-star"></i>
                <i class="fa-regular fa-star"></i>`
            )
        }else if(el.rating == 2){
            $('.plant_rating').empty();
            $('.plant_rating').append(
                `<i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>
                <i class="fa-regular fa-star"></i>
                <i class="fa-regular fa-star"></i>`
            )
        }else if(el.rating == 1){
            $('.plant_rating').empty();
            $('.plant_rating').append(
                `<i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>
                <i class="fa-regular fa-star"></i>
                <i class="fa-regular fa-star"></i>
                <i class="fa-regular fa-star"></i>`
            )
        }
    }
    
    console.log(db)
    let cartlist = [];
    $('.plant_addBtn').click((e)=>{
        for(let el of db){
            if(el._id == e.target.id){
                cartlist.push(el)
                console.log(cartlist)
            }
        }
        $('.mainPage_cartCounter').html(cartlist.length)
        $('.chosenPlantsContainer').empty();
        for(let el of cartlist){
            $('.chosenPlantsContainer').append(
                `<div class="chosenPlant">
                <img class="chosenPlant_img" src="./imgs/${el.image}" alt="">
                <div class="chosenPlant_namePriceCon">
                    <div class="chosenPlant_name">${el.title}</div>
                    <div class="chosenPlant_price">$${el.price}.00</div>
                </div>
                <div class="chosenPlant_delete" id="deleteFromCart${el._id}"><div class="minus"></div></div>
            </div>`
            )
        }
    })

    $('.mainPage_cart').click(()=>{
        $('.cartPopupContainer').css('display', 'flex')
    })
    $('#cartPopup_xmark').click(()=>{
        $('.cartPopupContainer').css('display', 'none')
    })
    //hover effects 
$('.chosenPlantsContainer').on('mouseenter', '.chosenPlant_delete', function() {
    $(this).css('background-color', '#081323');
    $(this).find('.minus').css('background-color', '#fff');
}).on('mouseleave', '.chosenPlant_delete', function() {
    $(this).css('background-color', '#fff');
    $(this).find('.minus').css('background-color', '#081323');

}); 

//plant deleting from the cartList
$('.chosenPlantsContainer').on('click', '.chosenPlant_delete', function(e) {
    e.stopPropagation();
    let ID = e.target.id;
    if (ID.substring(0, 14) === 'deleteFromCart') {
        let plantID = ID.substring(14);
        cartlist = cartlist.filter(el => el._id !== plantID);
        $('.mainPage_cartCounter').html(cartlist.length);
        renderChosenPlants();
    }
});

function renderChosenPlants() {
    $('.chosenPlantsContainer').empty();
    for (let el of cartlist) {
        $('.chosenPlantsContainer').append(
            `<div class="chosenPlant">
                <img class="chosenPlant_img" src="./imgs/${el.image}" alt="">
                <div class="chosenPlant_namePriceCon">
                    <div class="chosenPlant_name">${el.title}</div>
                    <div class="chosenPlant_price">$${el.price}.00</div>
                </div>
                <div class="chosenPlant_delete" id="deleteFromCart${el._id}"><div class="minus"></div></div>
            </div>`
        );
    }
}
})

//cookies animation
$('.cookiesJar_con').hover(
    ()=>{
        $('#cookie1').css('top', '80px')
        $('#cookie1').css('left', '0px')
        $('#cookie2').css('top', '50px')
        $('#cookie2').css('left', '100px')
        $('#cookie3').css('top', '55px')
        $('#cookie3').css('left', '40px')
        $('#cookie4').css('top', '110px')
        $('#cookie4').css('left', '20px')
        $('#cookie5').css('top', '100px')
        $('#cookie5').css('left', '60px')
        $('#cookie6').css('top', '120px')
        $('#cookie6').css('left', '100px')
    },
    ()=>{
        $('#cookie1').css('top', '190px')
        $('#cookie1').css('left', '100px')
        $('#cookie2').css('top', '180px')
        $('#cookie2').css('left', '-3px')
        $('#cookie3').css('top', '184px')
        $('#cookie3').css('left', '50px')
        $('#cookie4').css('top', '150px')
        $('#cookie4').css('left', '93px')
        $('#cookie5').css('top', '140px')
        $('#cookie5').css('left', '45px')
        $('#cookie6').css('top', '145px')
        $('#cookie6').css('left', '-5px')
    }
)

//cookies functionality 
$(document).ready(function() {
    checkPopupCookie();
});
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkPopupCookie() {
    const popupClosed = getCookie("popupClosed");
    if (popupClosed === "true") {
        console.log("Popup cookie detected. Closing popup.");
        $(".cookiesPopupContainer").css('display', 'none');
    } else {
        console.log("No popup cookie detected. Showing popup.");
        $(".cookiesPopupContainer").css('display', 'flex');
        
        $("#acceptCookiesBtn").click(function() {
            console.log("Accept cookies button clicked.");
            closePopup();
        });
    }
}
function closePopup() {
    console.log("Closing popup and setting cookie.");
    $(".cookiesPopupContainer").css('display', 'none');
    setCookie("popupClosed", "true", 365);
}

