
// function for animation on landing page
var animatePoints = function () {
    
    // revelPoint function no longer needs a argument (array of points). replaced by $(this).
    var revealPoint = function () {
        //$(this) references a different .point(div) element each time jQuery executes the revealPoint() callback.
        // since css has the .point selector we can use that in jQuery to add more styling properties.Due to jQuery's cross-browser compatibility, we don't need to use vendor prefixes on the transform property.
        
        $(this).css({
            opacity: 1,
            transform: 'scaleX(1) translateY(0)'
        });
    };
    // replaces the for loop. $.each() method iterates over each .point(div) element and executes the callback function, revealPoint.
    $.each($('.point'), revealPoint);
};


// Use jQuery to specify what happens with the landing page loads
$(window).load(function() {
    // height () method gets or sets an object's height. Here it's the window object.
    if ($(window).height() > 950) {
        animatePoints();
    }
    
    // using jQuery get the .selling-points element. using offset () and top () methods get the distance from the top to the .selling-points element.
    var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;    
    
    // no longer need the addEventListener() JavaScript method, instead use scroll() and pass it a function as an argument. scroll() is the event handler, so when the window scrolls the function executes.
    $(window).scroll(function(event) {
        // check scrollTop() for html and body
        if ($(window).scrollTop() >= scrollDistance) {
            animatePoints();
        }
    });
});