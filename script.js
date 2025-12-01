//alert("I am connected!");
// 1. Initialize Bootstrap Carousel
$('.carousel').carousel({
    interval: 5000
});

// 2. Gallery Filter Logic (For Memories Page)
$(document).ready(function(){
    $(".filter-btn").click(function(){
        var value = $(this).attr('data-filter');
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");

        if(value == "all"){
            $('.gallery-item').show('1000');
        }
        else{
            $(".gallery-item").not('.'+value).hide('3000');
            $('.gallery-item').filter('.'+value).show('3000');
        }
    });
});

// 3. Contact Form Integration (Only runs if form exists)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    // Only run this code if the contactForm is actually on the page
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop page reload

            // Get data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Send to server
            fetch('http://localhost:3000/submit-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message }),
            })
            .then(response => response.json())
            .then(data => {
                const responseDiv = document.getElementById('formResponse');
                if(responseDiv) {
                    responseDiv.style.display = 'block';
                    responseDiv.innerText = data.message;
                }
                contactForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("Server error. Make sure 'node server.js' is running!");
            });
        });
    }
});

// 4. Callback Form Integration (Only runs if form exists)
document.addEventListener('DOMContentLoaded', function() {
    const callbackForm = document.getElementById('callbackForm');

    // Only run this code if the callbackForm is actually on the page
    if (callbackForm) {
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('parentName').value;
            const phone = document.getElementById('parentPhone').value;
            const message = document.getElementById('parentMessage').value;

            fetch('http://localhost:3000/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, phone: phone, message: message }),
            })
            .then(response => response.json())
            .then(data => {
                const responseDiv = document.getElementById('formResponse');
                if(responseDiv) {
                    responseDiv.style.display = 'block';
                    responseDiv.innerText = data.message;
                }
                callbackForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("Server error. Make sure 'node server.js' is running!");
            });
        });
    }
});