// plants functionality
let db = [];
let cartlist = [];
let totalAmount = 0;
axios.get('http://localhost:3000/plants')
.then((res) => {
    console.log(res.data)
    for (let el of res.data) {
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

        // Plants rating displaying
        let $ratingContainer = $('.plant_rating').last();
        $ratingContainer.empty();
        for (let i = 0; i < el.rating; i++) {
            $ratingContainer.append(`<i class="fa-solid fa-star"></i>`);
        }
        for (let i = el.rating; i < 5; i++) {
            $ratingContainer.append(`<i class="fa-regular fa-star"></i>`);
        }
    }
    console.log(db)
    changeTheme(theme)
    $('.plant_addBtn').click((e) => {
        $('.addingMessage').css('display', 'flex')
        setTimeout(() => {
            $('.addingMessage').css('display', 'none')
        }, 2000);

        let plantID = e.target.id;
        let existingPlant = cartlist.find(plant => plant._id === plantID);

        if (existingPlant) {
            existingPlant.amount++;
        } else {
            let plantToAdd = db.find(plant => plant._id === plantID);
            plantToAdd.amount = 1;
            cartlist.push(plantToAdd);
        }

        renderCart();
    });
});
function renderCart() {
    $('.mainPage_cartCounter').html(cartlist.length);
    $('.chosenPlantsContainer').empty();
    totalAmount = 0;

    cartlist.forEach(plant => {
        $('.chosenPlantsContainer').append(
            `<div class="chosenPlant">
                <div class="chosenPlant_imgContainer">
                    <img class="chosenPlant_img" src="./imgs/${plant.image}" alt="">
                </div>
                <div class="chosenPlant_namePriceCon">
                    <div class="chosenPlant_name">${plant.title}</div>
                    <div class="chosenPlant_price">$${plant.price}.00</div>
                </div>
                <div class="chosenPlant_amountContaner">
                    <div class="reducePlant_amount plantAmountchanger" data-id="${plant._id}">-</div>
                    <div class="chosenPlant_amount">${plant.amount}</div>
                    <div class="increasePlant_amount plantAmountchanger" data-id="${plant._id}">+</div>
                </div>
                <div class="chosenPlant_bin">
                    <img class="chosenPlant_top" src="./imgs/bin top.png" alt="">
                    <img class="chosenPlant_bottom" id="deleteFromCart${plant._id}" src="./imgs/bin bottom.png" alt="">
                </div>
            </div>`
        );
        totalAmount += plant.price * plant.amount;
    });

    $('#totalAmount').html(`Total amount: $${totalAmount}.00`);
    $('#chosenPlantCount').html(`Plants chosen: ${cartlist.length}`);

    // Event delegation for reduce/increase buttons
    $('.chosenPlantsContainer').off('click').on('click', '.reducePlant_amount', function() {
        let plantID = $(this).data('id');
        let plant = cartlist.find(p => p._id === plantID);
        if (plant) {
            plant.amount = Math.max(1, plant.amount - 1);  // Ensure amount does not go below 1
            renderCart();
        }
        changeTheme(theme)
    });

    $('.chosenPlantsContainer').on('click', '.increasePlant_amount', function() {
        let plantID = $(this).data('id');
        let plant = cartlist.find(p => p._id === plantID);
        if (plant) {
            plant.amount++;
            renderCart();
        }
        changeTheme(theme)
    });

    // Plant deleting from the cartList
$('.chosenPlantsContainer').on('click', '.chosenPlant_bottom', function(e) {
    e.stopPropagation();
    let ID = e.target.id;
    if (ID.substring(0, 14) === 'deleteFromCart') {
        let plantID = ID.substring(14);
        let index = cartlist.findIndex(plant => plant._id === plantID);
        if (index !== -1) {
            cartlist.splice(index, 1);
            renderCart();
        }
    }
    changeTheme(theme)
});

    // Bin hover effect
    $('.chosenPlant_bin').hover(
        function () {
            $(this).find('.chosenPlant_top').css('top', '-6px');
            $(this).find('.chosenPlant_top').css('transform', 'rotate(-15deg)');
        },
        function () {
            $(this).find('.chosenPlant_top').css('top', '0px');
            $(this).find('.chosenPlant_top').css('transform', 'rotate(0deg)');
        }
    );
}
$('.mainPage_cart').click(() => {
    $('.cartPopupContainer').css('display', 'flex');
    changeTheme(theme)
});
$('#cartPopup_xmark').click(() => {
    $('.cartPopupContainer').css('display', 'none');
});

//ordering
$('#buyBtn').click(() => {
    let data = {
        list: cartlist,
        name: $('#userName').val(),
        phone: $('#userPhone').val(),
        message: $('#userMessage').val(),
    };
    console.log(data);
    axios.post('/new-order', data)
        .then(res => {
            console.log(`Order data was sended`);
        })
})

// Hover effects 
$('.chosenPlantsContainer').on('mouseenter', '.chosenPlant_delete', function() {
    $(this).css('background-color', '#081323');
    $(this).find('.minus').css('background-color', '#fff');
}).on('mouseleave', '.chosenPlant_delete', function() {
    $(this).css('background-color', '#fff');
    $(this).find('.minus').css('background-color', '#081323');
});

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

//theme changing
let theme = localStorage.getItem('theme') || 'light';
$('.mainPage_theme').click(function(){
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
        $('.mainPage_theme').css('justify-content', 'flex-start')
        $('.mainPage_theme').css('background-color', '#fff')
        $('.mainPage_theme_circle').css('background-color', '#283444')
        $('.mainPage_theme_circle').css('border', '2px #fff solid')
        $('.wrap').css('background-color', '#fff')
        $('.mainPage_blur').css('background', 'linear-gradient(to bottom, #ffffff00, #FFFFFF)')
        $('.mainPage').css('color', '#fff')
        $('a').css('color', '#fff')
        $('.mainPage_searchInput').css('color', '#fff')
        $('.mainPage_searchInput').css('border', '1px #fff solid')
        $('.mainPage_searchInput::placeholder').css('color', '#fff')
        $('.mainPage_searchBtn_icon').attr('src', './imgs/search.png')
        $('#cart').attr('src', './imgs/cart.png')
        $('.plants_abilityTitile').css('color', '#081323')
        $('.plantsContainer_title').css('color', '#081323')
        $('.plant_imgCon').css('background-color', '#C1D0E4')
        $('.plant_textCon').css('background-color', '#fff')
        $('.addingMessage').css('background-color', '#fff')
        $('.addingMessage').css('color', '#081323')
        $('.addingMessage').css('border', '2px #081323 solid')
        $('.interior_title').css('color', '#081323')
        $('.interior_subtitle').css('color', '#4F4F4F')
        $('.care_title').css('color', '#081323')
        $('.care_subtitle').css('color', '#4F4F4F')
        $('.care_tipTitle').css('color', '#081323')
        $('.care_tipDescription').css('color', '#4F4F4F')
        $('.futer').css('background', 'linear-gradient( to right bottom, #566270, #283444 )')
        $('.ordersWrapper').css('color', '#566270')
        $('.cartPopup').css('background-color', '#fff')
        $('.xmark').css('color', '#000')
        $('h1').css('color', '#081323')
        $('.chosenPlant').css('border', '1px #283444 solid')
        $('.chosenPlant_name').css('color', '#081323')
        $('.chosenPlant_price').css('color', '#081323')
        $('.chosenPlant_amount').css('color', '#566270')
        $('.plantAmountchanger').css('color', '#566270')
        $('.chosenPlant_top').attr('src', './imgs/bin top.png')
        $('.chosenPlant_bottom').attr('src', './imgs/bin bottom.png')
        $('#chosenPlantCount').css('color', '#081323')
        $('#totalAmount').css('color', '#081323')
        $('h2').css('color', '#283444')
        $('.paymentMethod').css('background-color', 'none')
        $('.paymentMethod').css('padding', 'none')

        $('#buyBtn').css('background-color', '#fff')
        $('#buyBtn').css('border', '1px #081323 solid')
        $('#buyBtn').css('color', '#081323')
        $('#buyBtn').hover(
            () => {
                $('#buyBtn').css({
                    'background-color': '#081323',
                    'color': '#fff',
                });
            },
            () => {
                $('#buyBtn').css({
                    'background-color': '#fff',
                    'color': '#081323',
                });
            }
        );
    }else{
        $('.mainPage_theme').css('justify-content', 'flex-end')
        $('.mainPage_theme').css('background-color', '#1E1E1E')
        $('.mainPage_theme_circle').css('background-color', '#fff')
        $('.mainPage_theme_circle').css('border', '2px #081323 solid')
        $('.wrap').css('background-color', '#1E1E1E')
        $('.mainPage_blur').css('background', 'linear-gradient(to bottom, #ffffff00, #1E1E1E)')
        $('.mainPage').css('color', '#1E1E1E')
        $('a').css('color', '#1E1E1E')
        $('.mainPage_searchInput').css('color', '#1E1E1E')
        $('.mainPage_searchInput').css('border', '1px #1E1E1E solid')
        $('.mainPage_searchInput::placeholder').css('color', '#1E1E1E')
        $('.mainPage_searchBtn_icon').attr('src', './imgs/search dark.png')
        $('.mainPage_searchBtn_icon').css('width', '24px')
        $('#cart').attr('src', './imgs/cart dark.png')
        $('.plants').css('color', '#1E1E1E')
        $('.plants_abilityTitile').css('color', '#fff')
        $('.plantsContainer_title').css('color', '#fff')
        $('.plant_imgCon').css('background-color', '#46658f')
        $('.plant_textCon').css('background-color', '#fff')
        $('.addingMessage').css('background-color', '#1E1E1E')
        $('.addingMessage').css('color', '#fff')
        $('.addingMessage').css('border', '2px #fff solid')
        $('.interior_title').css('color', '#fff')
        $('.interior_subtitle').css('color', '#eee')
        $('.care_title').css('color', '#fff')
        $('.care_subtitle').css('color', '#eee')
        $('.care_tipTitle').css('color', '#fff')
        $('.care_tipDescription').css('color', '#eee')
        $('.futer').css('background', 'linear-gradient( to right bottom, #1E1E1E, #283444 )')
        $('.ordersWrapper').css('color', '#fff')
        $('.cartPopup').css('background-color', '#1E1E1E')
        $('.xmark').css('color', '#fff')
        $('h1').css('color', '#fff')
        $('.chosenPlant').css('border', '1px #fff solid')
        $('.chosenPlant_name').css('color', '#fff')
        $('.chosenPlant_price').css('color', '#fff')
        $('.chosenPlant_amount').css('color', '#ccc')
        $('.plantAmountchanger').css('color', '#ccc')
        $('.chosenPlant_top').attr('src', './imgs/bin top dark theme.png')
        $('.chosenPlant_bottom').attr('src', './imgs/bin bottom dark theme.png')
        $('#chosenPlantCount').css('color', '#fff')
        $('#totalAmount').css('color', '#fff')
        $('h2').css('color', '#fff')
        $('.paymentMethod').css('background-color', '#fff')
        $('.paymentMethod').css('padding', '0 10px')

        $('#buyBtn').css('background-color', '#1E1E1E')
        $('#buyBtn').css('border', '1px #fff solid')
        $('#buyBtn').css('color', '#fff')
        $('#buyBtn').hover(
            () => {
                $('#buyBtn').css({

                    'background-color': '#fff',
                    'color': '#1E1E1E',
                    'border': '1px #1E1E1E solid',
                });
            },
            () => {
                $('#buyBtn').css({
                    'background-color': '#1E1E1E',
                    'color': '#fff',
                    'border': '1px #fff solid',

                });
            }
        );
    }
}
changeTheme(theme);

//contacts changing
axios.get('http://localhost:3000/getContacts')
.then((res)=>{
    console.log(res.data);
    const contacts = res.data;
    contacts.forEach(contact => {
        $('#contacts_address').html(contact.address);
        $('#contacts_email').html(contact.email);
        $('#contacts_phone').html(contact.phone);
    });
})
.catch((err) => {
    console.error(err);
});


//emails sending
$('#subscribe').click(() => {
    let data = {
        email: $('#email').val()
    };
    axios.post('http://localhost:3000/send-mail', data)
        .then(res => {
            alert('Email saved');
            $('#email').val('');
        })
});