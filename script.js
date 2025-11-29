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

// --- CONTACT FORM INTEGRATION ---
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page reload

    // 1. Get data from the form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // 2. Send to Node.js Server
    fetch('http://localhost:3000/submit-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
    })
    .then(response => response.json())
    .then(data => {
        // 3. Show success message
        const responseDiv = document.getElementById('formResponse');
        responseDiv.style.display = 'block';
        responseDiv.innerText = data.message;
        
        // Clear the form
        document.getElementById('contactForm').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Server error. Is 'node server.js' running?");
    });
});