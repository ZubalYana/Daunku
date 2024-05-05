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
})
