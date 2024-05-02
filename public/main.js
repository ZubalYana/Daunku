axios.get('http://localhost:3000/plants')
.then((res)=>{
    console.log(res.data)
    for(let el of res.data){
        $('.plantsContainer').append(
            `<div class="plant">
            <div class="plant_imgCon">
            <img class="plant_img", src="./imgs/${el.image}">
            <div class="plant_textCon">
            <div class="plant_title">${el.title}<div>
            <div class="plant_pating">${el.rating}<div>
            <div class="plant_price">$${el.price}.00<div>
            <div>
            <div>


            <div>`
        )
    }
})
