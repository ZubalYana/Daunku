//pages changing
$('.content').append(
    `
    <div class="plantsWrapper">
    <div class="newPlantsAndStatisticsCon">
    <div class="addNewPlantsBtn">+</div>
    <div class="statistics"></div>
    </div>
    <div class="plantslist"></div>
    <div class="plantAddedMessage">Plant was added to the catalog successfully!</div>

    </div>
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
        <div class="plantsWrapper">
        <div class="newPlantsAndStatisticsCon">
        <div class="addNewPlantsBtn">+</div>
        <div class="statistics"></div>
        </div>
        <div class="plantslist"></div>
        <div class="plantAddedMessage">Plant was added to the catalog successfully!</div>
        </div>
        `
    )
    getPlants();

})
$('#contacts').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '600')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '400')
    $('.content').append(
        `<div class="contactsWrapper">
        <div class="message">Contacts were changed</div>
        <div class="contacts_leftPart">
        <h2>Contacts:</h2>
            <input type="text" class="contacts_input" id="address" placeholder="Address">
            <input type="text" class="contacts_input" id="phone" placeholder="Phone">
            <input type="text" class="contacts_input" id="email" placeholder="Email">
            <button id="changeContacts">Change contacts</button>
        </div>
        <div class="contacts_rightPart">

        </div>
        </div>
        `
    )
    changeTheme(theme)
    $('#changeContacts').click(()=>{
        const data = {
            address: $('#address').val(),
            phone: $('#phone').val(),
            email: $('#email').val(),
        }
        axios.post('/contacts', data)
        .then((res)=>{
            console.log(res.data)
            $('#address').val('')
            $('#phone').val('')
            $('#email').val('')
            $('.message').css('display', 'flex')
            setTimeout(() => {
                $('.message').css('display', 'none')
            }, 4000);
        })
    })
})
$('#newslatter').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '600')
    $('#orders').css('font-weight', '400')
    $('.content').append(
        `
        <div class="newsWrapper">
        <div class="News_message">The news were sended</div>
        <h2>Send news to your customers!</h2>
        <textarea type="text" id="message"></textarea>
        <button id="sendMessage">Send</button>
        <div id="myChart"></div>
        </div>
        `
    )
    changeTheme(theme)
    //emails sending
$('#sendMessage').click(()=>{
    const data = {
        message: $('#message').val()
    }
    console.log(data)
    axios.post('http://localhost:3000/send-message', data)
    .then((res)=>{
        console.log(res.data)
        console.log(`Message sended to the server`)
        $('#message').val('')
        $('.News_message').css('display', 'flex')
        setTimeout(() => {
            $('.News_message').css('display', 'none')
        }, 4000);
        $('#email').val('');
    })
})

})
$('#orders').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '600')
    $('.content').append(
        `<div class="ordersWrapper">
        <h2>New orders:</h2>
        <div class="ordersContainer"></div>
        <h2>Finished orders:</h2>
        <div class="finishedOrdersContainer"></div>
        </div>
        `
    )
    changeTheme(theme)
// Function to load the orders page
function loadOrdersPage() {
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '600')
    $('.content').append(
        `<div class="ordersWrapper">
        <h2>New orders:</h2>
        <div class="ordersContainer"></div>
        <h2>Finished orders:</h2>
        <div class="finishedOrdersContainer"></div>
        </div>`
    );

    getOrders();
}

// Function to get orders
function getOrders() {
    axios.get('http://localhost:3000/orders')
        .then(res => {
            $('.ordersContainer').empty();
            $('.finishedOrdersContainer').empty();

            for (let el of res.data) {
                // Aggregate plant quantities
                let plantQuantities = {};
                for (let list of el.list) {
                    if (plantQuantities[list.title]) {
                        plantQuantities[list.title] += list.amount;
                    } else {
                        plantQuantities[list.title] = list.amount;
                    }
                }

                // Format the order list
                let orderList = '';
                for (let [title, amount] of Object.entries(plantQuantities)) {
                    orderList += `${title} (${amount}), `;
                }
                orderList = orderList.slice(0, -2);

                // Define the status options
                let statusOptions = `
                    <select class="statusDropdown" data-id="${el._id}">
                        <option value="false" ${el.status === false ? 'selected' : ''}>In progress</option>
                        <option value="true" ${el.status === true ? 'selected' : ''}>Completed</option>
                    </select>
                `;

                // Append the order to the appropriate container
                let orderHTML = `
                    <div class='order'>
                        <p class="list">${orderList}</p>
                        <div class="order_contacts">${el.name}: ${el.phone}</div>
                        <div class="order_message">${el.message}</div>
                        ${statusOptions}
                        <div class="order_delete">
                            <img class="order_delete_top" src="./imgs/bin top.png" alt="">
                            <img class="order_delete_bottom transhcan" id="${el._id}" src="./imgs/bin bottom.png" alt="">
                        </div>
                    </div>
                `;

                if (el.status === false) {
                    $('.ordersContainer').append(orderHTML);
                } else {
                    $('.finishedOrdersContainer').append(orderHTML);
                }
            }

            // Attach event handlers for delete buttons and dropdowns
            $('.transhcan').click((e) => {
                let id = e.target.id;
                console.log(id);
                axios.delete(`http://localhost:3000/orders/${id}`)
                    .then(res => {
                        getOrders(); // Reload the orders section
                    });
            });

            $('.order_delete').hover(
                function () {
                    $(this).find('.order_delete_top').css('top', '-6px');
                    $(this).find('.order_delete_top').css('transform', 'rotate(-15deg)');
                },
                function () {
                    $(this).find('.order_delete_top').css('top', '0px');
                    $(this).find('.order_delete_top').css('transform', 'rotate(0deg)');
                }
            );

            $('.statusDropdown').change(e => {
                let ID = $(e.target).data('id');
                let newStatus = $(e.target).val() === 'true';
                axios.put(`http://localhost:3000/edit-orderStatus/${ID}`, { status: newStatus })
                    .then(res => {
                        getOrders(); // Reload the orders section
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
            changeTheme(theme)
        });
}

// Click handler for the orders button
$('#orders').click(() => {
    loadOrdersPage();
});

    getOrders();
    
    
})

//existing plants displaying
function getPlants(){
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
                <div class="plantPrice">$${el.price}.00</div>
                <div class="plant_actions">
        <div class="plant_edit">
            <img class="plant_edit_pen" src="./imgs/pen.png" alt="" id="edit${el._id}">
        </div>
        <div class="plant_delete">
            <img class="plant_delete_top" src="./imgs/bin top.png" alt="">
            <img class="plant_delete_bottom" id="${el._id}" src="./imgs/bin bottom.png" alt="">
        </div>
    </div>
            </div>
                `
            )
            changeTheme(theme)
        }
    
        //actions animations
        $('.plant_delete').hover(
            function () {
                $(this).find('.plant_delete_top').css('top', '-6px');
                $(this).find('.plant_delete_top').css('transform', 'rotate(-15deg)');
            },
            function () {
                $(this).find('.plant_delete_top').css('top', '0px');
                $(this).find('.plant_delete_top').css('transform', 'rotate(0deg)');
            }
        ); 
        $('.plant_edit').hover(
            function () {
                $(this).find('.plant_edit_pen').css('transform', 'rotate(-17deg)');
            },
            function () {
                $(this).find('.plant_edit_pen').css('transform', 'rotate(0deg)');
            }
        ); 
    
        //edtiting the platns
        $('.plant_edit_pen').click((e)=>{
            $('.editPlantPopup_container').css('display', 'flex')
            $('#editPlantPopupXmark').click(()=>{
                $('.editPlantPopup_container').css('display', 'none')
            })
            let ID = e.target.id;
            if (ID.substring(0, 4) == 'edit') {
                ID = ID.substring(4);
                console.log(ID);
        
                $('.editPlant_btn').click(()=>{
                    let data = {
                        image: $('#newPlant_image').val(),
                        title: $('#newPlant_name').val(),
                        rating: $('#newPlant_rating').val(),
                        price: $('#newPlant_price').val(),
                    };
                    axios.put(`http://localhost:3000/edit-plant/${ID}`, data)
                        .then(res => {
                            $('.editTaskPopup_container').css('display', 'none')
                            location.reload();
                        })
                })
            }
        })
    
        //deleting plants from the catalog
        $('.plant_delete_bottom').click((e)=>{
        console.log(e.target)
        let id = e.target.id;
        console.log(id)
        axios.delete(`http://localhost:3000/plant/${id}`)
        .then(res => {
            location.reload()
        })
        })

        //statistics
        let allPlantsSum = 0;
        let averagePrice = 0;
        let ratingSum = 0;
        let averageRating = 0;
        for(let el of res.data){
            allPlantsSum += el.price;
            averagePrice = allPlantsSum/res.data.length
            ratingSum += el.rating;
            averageRating = ratingSum/res.data.length
        }
        $('.statistics').append(
            `
            <h3>Statistics:</h3>
            <div class="statisticsEl">Plants amount:<div class="statisticsInfo">${res.data.length}</div></div>
            <div class="statisticsEl">Average plant price:<div class="statisticsInfo">$${Math.round(averagePrice * 100) / 100}</div></div>
            <div class="statisticsEl">Average plant rating:<div class="statisticsInfo">${Math.round(averageRating * 100) / 100}</div></div>
            `
        )
    
    })
    
};
getPlants();

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
        $('.theme').css('background-color', '#1E1E1E')
        $('.theme_circle').css('background-color', '#fff')
        $('.theme_circle').css('border', '2px #081323 solid')
        $('.wrap').css('background-color', '#fff')
        $('.navEl').css('color', '#566270')
        $('.logo').css('color', '#566270')
        $('.addNewPlantsBtn').css('border', '2px #566270 solid')
        $('.addNewPlantsBtn').css('background-color', '#fff')
        $('.addNewPlantsBtn').css('color', '#566270')
        $('.addNewPlantsBtn').hover(
            () => {
                $('.addNewPlantsBtn').css({
                    'background-color': '#566270',
                    'color': '#fff',
                });
            },
            () => {
                $('.addNewPlantsBtn').css({
                    'background-color': '#fff',
                    'color': '#566270',
                });
            }
        );
        $('.statistics').css('color', '#566270')
        $('.plant').css('border', '#566270 2px solid')
        $('.plant').css('color', '#566270')
        $('.plant_edit_pen').attr('src', './imgs/pen.png')
        $('.plant_delete_top').attr('src', './imgs/bin top.png')
        $('.plant_delete_bottom').attr('src', './imgs/bin bottom.png')
        $('.order').css('border', '#283444 2px solid')
        $('h2').css('color', '#566270')
        $('.order').css('color', '#566270')
        $('select').css('background-color', '#fff')
        $('select').css('color', '#566270')
        $('.order_delete_top').attr('src', './imgs/bin top.png')
        $('.order_delete_bottom').attr('src', './imgs/bin bottom.png')
        $('#changeContacts').css('background-color', '#fff')
        $('#changeContacts').css('color', '#566270')
        $('#changeContacts').hover(
            () => {
                $('#changeContacts').css({
                    'background-color': '#566270',
                    'color': '#fff',
                });
            },
            () => {
                $('#changeContacts').css({
                    'background-color': '#fff',
                    'color': '#566270',
                });
            }
        );
        $('input').css('background-color', '#fff')
        $('#sendMessage').css('background-color', '#fff')
        $('#sendMessage').css('color', '#566270')
        $('#sendMessage').hover(
            () => {
                $('#sendMessage').css({
                    'background-color': '#566270',
                    'color': '#fff',
                });
            },
            () => {
                $('#sendMessage').css({
                    'background-color': '#fff',
                    'color': '#566270',
                });
            }
        );
        $('textarea').css('background-color', '#fff')
        $('textarea').css('color', '#566270')
        $('.addNewPlantPopup').css('background-color', '#fff')
        $('#addNewPlantXmark').css('color', '#000')
        $('h3').css('color', '#566270')
        $('input').css('border', '1px #081323 solid')
        $('.addNewPlant_btn').css('border', '1px #081323 solid')
        $('.addNewPlant_btn').css('background-color', '#fff')
        $('.addNewPlant_btn').css('color', '#081323')
        $('.addNewPlant_btn').hover(
            () => {
                $('.addNewPlant_btn').css({
                    'background-color': '#081323',
                    'color': '#fff',
                });
            },
            () => {
                $('.addNewPlant_btn').css({
                    'background-color': '#fff',
                    'color': '#081323',
                });
            }
        );
        $('.plantAddedMessage').css('background-color', '#fff')
        $('.plantAddedMessage').css('color', '#081323')
        $('.plantAddedMessage').css('border', '1px #081323 solid')
        $('.editPlantPopup').css('background-color', '#fff')
        $('.editPlantPopup').css('color', '#081323')
        $('.editPlant_btn').css('border', '1px #081323 solid')
        $('.editPlant_btn').css('background-color', '#fff')
        $('.editPlant_btn').css('color', '#081323')
        $('.editPlant_btn').hover(
            () => {
                $('.editPlant_btn').css({
                    'background-color': '#081323',
                    'color': '#fff',
                });
            },
            () => {
                $('.editPlant_btn').css({
                    'background-color': '#fff',
                    'color': '#081323',
                });
            }
        );
        $('#burger').css('background-color', '#fff')
        $('#burger').css('color', '#566270')
        $('.burgerRow').css('background-color', '#566270')
        
    }else{
        $('.theme').css('justify-content', 'flex-end')
        $('.theme').css('background-color', '#fff')
        $('.theme_circle').css('background-color', '#283444')
        $('.theme_circle').css('border', '2px #fff solid')
        $('.wrap').css('background-color', '#1E1E1E')
        $('.navEl').css('color', '#fff')
        $('.logo').css('color', '#fff')
        $('.addNewPlantsBtn').css('border', '2px #fff solid')
        $('.addNewPlantsBtn').css('background-color', '#1E1E1E')
        $('.addNewPlantsBtn').css('color', '#fff')
        $('.addNewPlantsBtn').hover(
            () => {
                $('.addNewPlantsBtn').css({
                    'background-color': '#fff',
                    'color': '#1E1E1E',
                });
            },
            () => {
                $('.addNewPlantsBtn').css({
                    'background-color': '#1E1E1E',
                    'color': '#fff',
                });
            }
        );
        $('.statistics').css('color', '#fff')
        $('.plant').css('border', '#fff 2px solid')
        $('.plant').css('color', '#fff')
        $('.plant_edit_pen').attr('src', './imgs/pen dark theme.png')
        $('.plant_delete_top').attr('src', './imgs/bin top dark theme.png')
        $('.plant_delete_bottom').attr('src', './imgs/bin bottom dark theme.png')
        $('.order').css('border', '#fff 2px solid')
        $('h2').css('color', '#fff')
        $('.order').css('color', '#fff')
        $('select').css('background-color', '#1E1E1E')
        $('select').css('color', '#fff')
        $('.order_delete_top').attr('src', './imgs/bin top dark theme.png')
        $('.order_delete_bottom').attr('src', './imgs/bin bottom dark theme.png')
        $('#changeContacts').css('background-color', '#1E1E1E')
        $('#changeContacts').css('color', '#fff')
        $('#changeContacts').hover(
            () => {
                $('#changeContacts').css({
                    'background-color': '#fff',
                    'color': '#1E1E1E',
                });
            },
            () => {
                $('#changeContacts').css({
                    'background-color': '#1E1E1E',
                    'color': '#fff',
                });
            }
        );
        $('#sendMessage').css('background-color', '#1E1E1E')
        $('#sendMessage').css('color', '#fff')
        $('#sendMessage').hover(
            () => {
                $('#sendMessage').css({
                    'background-color': '#fff',
                    'color': '#1E1E1E',
                });
            },
            () => {
                $('#sendMessage').css({
                    'background-color': '#1E1E1E',
                    'color': '#fff',
                });
            }
        );
        $('input').css('background-color', '#1E1E1E')
        $('textarea').css('background-color', '#1E1E1E')
        $('textarea').css('color', '#fff')
        $('.addNewPlantPopup').css('background-color', '#1E1E1E')
        $('#addNewPlantXmark').css('color', '#fff')
        $('h3').css('color', '#fff')
        $('input').css('border', '1px #fff solid')
        $('.addNewPlant_btn').css('background-color', '#1E1E1E')
        $('.addNewPlant_btn').css('color', '#fff')
        $('.addNewPlant_btn').css('border', '1px #fff solid')
        $('.addNewPlant_btn').hover(
            () => {
                $('.addNewPlant_btn').css({
                    'background-color': '#fff',
                    'color': '#1E1E1E',
                });
            },
            () => {
                $('.addNewPlant_btn').css({
                    'background-color': '#1E1E1E',
                    'color': '#fff',
                });
            }
        );
        $('.plantAddedMessage').css('background-color', '#1E1E1E')
        $('.plantAddedMessage').css('color', '#fff')
        $('.plantAddedMessage').css('border', '1px #fff solid')
        $('.editPlantPopup').css('background-color', '#1E1E1E')
        $('.editPlantPopup').css('color', '#fff')
        $('.editPlant_btn').css('background-color', '#1E1E1E')
        $('.editPlant_btn').css('color', '#fff')
        $('.editPlant_btn').css('border', '1px #fff solid')
        $('.editPlant_btn').hover(
            () => {
                $('.editPlant_btn').css({
                    'background-color': '#fff',
                    'color': '#1E1E1E',
                });
            },
            () => {
                $('.editPlant_btn').css({
                    'background-color': '#1E1E1E',
                    'color': '#fff',
                });
            }
        );
        $('#burger').css('background-color', '#1E1E1E')
        $('#burger').css('color', '#fff')
        $('.burgerRow').css('background-color', '#fff')

    }
}
changeTheme(theme);

//adding new plants
$('.addNewPlantsBtn').click(()=>{
    $('.addNewPlantPopup_container').css('display', 'flex')
})
$('#addNewPlantXmark').click(()=>{
    $('.addNewPlantPopup_container').css('display', 'none')
})
$('.addNewPlant_btn').click(()=>{
    $('.addNewPlantPopup_container').css('display', 'none')

    let data = {
        title: $('#plant_name').val(),
        price: $('#plant_price').val(),
        image: $('#plant_image').val(),
        rating: $('#plant_rating').val()
    }
    axios.post('http://localhost:3000/add-plants', data)
    .then(()=>{

        $('.plantAddedMessage').css('display', 'flex')
        setTimeout(() => {
            $('.plantAddedMessage').css('display', 'none')
        }, 2000);
        setTimeout(() => {
            location.reload();
        }, 3000);
    })

})


//burger functionality
$('#headerBurger').click(()=>{
    $('.burger_con').css('display', 'flex')
})
$('#burgerXmark').click(()=>{
    $('.burger_con').css('display', 'none')
})
$('#menu_plants').click(()=>{
    $('.content').empty();
    $('.burger_con').css('display', 'none')
    $('#plants').css('font-weight', '600')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '400')
    $('.content').append(
        `
        <div class="plantsWrapper">
        <div class="newPlantsAndStatisticsCon">
        <div class="addNewPlantsBtn">+</div>
        <div class="statistics"></div>
        </div>
        <div class="plantslist"></div>
        <div class="plantAddedMessage">Plant was added to the catalog successfully!</div>
        </div>
        `
    )
    getPlants();

})
$('#menu_contacts').click(()=>{
    $('.content').empty();
    $('.burger_con').css('display', 'none')
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '600')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '400')
    $('.content').append(
        `<div class="contactsWrapper">
        <div class="contacts_leftPart">
        <h2>Contacts:</h2>
            <input type="text" class="contacts_input" id="address" placeholder="Address">
            <input type="text" class="contacts_input" id="phone" placeholder="Phone">
            <input type="text" class="contacts_input" id="email" placeholder="Email">
            <button id="changeContacts">Change contacts</button>
        </div>
        <div class="contacts_rightPart"></div>
        </div>
        `
    )
    changeTheme(theme)
    $('#changeContacts').click(()=>{
        const data = {
            address: $('#address').val(),
            phone: $('#phone').val(),
            email: $('#email').val(),
        }
        axios.post('/contacts', data)
        .then((res)=>{
            console.log(res.data)
            $('#address').val('')
            $('#phone').val('')
            $('#email').val('')
        })
    })
})
$('#menu_news').click(()=>{
    $('.content').empty();
    $('.burger_con').css('display', 'none')
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '600')
    $('#orders').css('font-weight', '400')
    $('.content').append(
        `
        <div class="newsWrapper">
        <h2>Send news to your customers!</h2>
        <textarea type="text" id="message"></textarea>
        <button id="sendMessage">Send</button>
        </div>
        `
    )
    changeTheme(theme)
    //emails sending
$('#sendMessage').click(()=>{
    const data = {
        message: $('#message').val()
    }
    console.log(data)
    axios.post('http://localhost:3000/send-message', data)
    .then((res)=>{
        console.log(res.data)
        console.log(`Message sended to the server`)
        $('#sendMessage').val('')
    })
})

})
$('#menu_orders').click(()=>{
    $('.content').empty();
    $('.burger_con').css('display', 'none')
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '600')
    $('.content').append(
        `<div class="ordersWrapper">
        <h2>New orders:</h2>
        <div class="ordersContainer"></div>
        <h2>Finished orders:</h2>
        <div class="finishedOrdersContainer"></div>
        </div>
        `
    )
    changeTheme(theme)
// Function to load the orders page
function loadOrdersPage() {
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '600')
    $('.content').append(
        `<div class="ordersWrapper">
        <h2>New orders:</h2>
        <div class="ordersContainer"></div>
        <h2>Finished orders:</h2>
        <div class="finishedOrdersContainer"></div>
        </div>`
    );

    getOrders();
}

// Function to get orders
function getOrders() {
    axios.get('http://localhost:3000/orders')
        .then(res => {
            $('.ordersContainer').empty();
            $('.finishedOrdersContainer').empty();

            for (let el of res.data) {
                // Aggregate plant quantities
                let plantQuantities = {};
                for (let list of el.list) {
                    if (plantQuantities[list.title]) {
                        plantQuantities[list.title] += list.amount;
                    } else {
                        plantQuantities[list.title] = list.amount;
                    }
                }

                // Format the order list
                let orderList = '';
                for (let [title, amount] of Object.entries(plantQuantities)) {
                    orderList += `${title} (${amount}), `;
                }
                orderList = orderList.slice(0, -2);

                // Define the status options
                let statusOptions = `
                    <select class="statusDropdown" data-id="${el._id}">
                        <option value="false" ${el.status === false ? 'selected' : ''}>In progress</option>
                        <option value="true" ${el.status === true ? 'selected' : ''}>Completed</option>
                    </select>
                `;

                // Append the order to the appropriate container
                let orderHTML = `
                    <div class='order'>
                        <p class="list">${orderList}</p>
                        <div class="order_contacts">${el.name}: ${el.phone}</div>
                        <div class="order_message">${el.message}</div>
                        ${statusOptions}
                        <div class="order_delete">
                            <img class="order_delete_top" src="./imgs/bin top.png" alt="">
                            <img class="order_delete_bottom transhcan" id="${el._id}" src="./imgs/bin bottom.png" alt="">
                        </div>
                    </div>
                `;

                if (el.status === false) {
                    $('.ordersContainer').append(orderHTML);
                } else {
                    $('.finishedOrdersContainer').append(orderHTML);
                }
            }

            // Attach event handlers for delete buttons and dropdowns
            $('.transhcan').click((e) => {
                let id = e.target.id;
                console.log(id);
                axios.delete(`http://localhost:3000/orders/${id}`)
                    .then(res => {
                        getOrders(); // Reload the orders section
                    });
            });

            $('.order_delete').hover(
                function () {
                    $(this).find('.order_delete_top').css('top', '-6px');
                    $(this).find('.order_delete_top').css('transform', 'rotate(-15deg)');
                },
                function () {
                    $(this).find('.order_delete_top').css('top', '0px');
                    $(this).find('.order_delete_top').css('transform', 'rotate(0deg)');
                }
            );

            $('.statusDropdown').change(e => {
                let ID = $(e.target).data('id');
                let newStatus = $(e.target).val() === 'true';
                axios.put(`http://localhost:3000/edit-orderStatus/${ID}`, { status: newStatus })
                    .then(res => {
                        getOrders(); // Reload the orders section
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
            changeTheme(theme)
        });
}

// Click handler for the orders button
$('#orders').click(() => {
    loadOrdersPage();
});

    getOrders();
    
    
})

