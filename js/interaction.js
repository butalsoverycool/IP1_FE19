/*
* INTERACTION JS
***************************/

$(function() {
    console.log( "interaction.js ready" );
    
    //autocollapse nav on link-click
    $('.nav.navbar-nav').click(function(){
        $('.navbar-toggle').click();
    });
    
});