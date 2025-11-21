// Initialize Bootstrap Carousel
$('.carousel').carousel({
    interval: 5000
});

// --- GALLERY FILTER LOGIC ---
$(document).ready(function(){

    $(".filter-btn").click(function(){
        var value = $(this).attr('data-filter');
        
        // 1. Change active button styling
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");

        // 2. Filter images
        if(value == "all"){
            $('.gallery-item').show('1000');
        }
        else{
            $(".gallery-item").not('.'+value).hide('3000');
            $('.gallery-item').filter('.'+value).show('3000');
        }
    });

});