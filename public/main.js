axios.get('http://localhost:3000/plants')
.then((res)=>{
    console.log(res.data)
    for(let el of res.data){
        $('.plantsContainer').append(
            `<div class="plant">
            <div class="plant_title">${el.title}<div>
            <div class="plant_price">${el.price}<div>
            <div>`
        )
    }
})
