/*
* INTERACTION JS
***************************/

const anchorScroll = function(elem) {
    let id = $(elem).attr('href');
    console.log('going to '+id);
}


$(function() {
    console.log( "interaction.js ready" );
    
    //Nav-dropdown, auto-close on doc-click
    $(document).click( () => {
        let navOpen = $('.navbar-collapse')
            .hasClass('navbar-collapse flex-cont collapse show');
        if(navOpen){
            $('.navbar-toggle').click();
        }
    });
    
    //Nav-links, autoscroll to elem
    $('.navbar-nav li span, .link_logotype').click(function() {
        console.log( $(this).attr('data-link') )
        let dataLink = $(this).attr('data-link');
        let options = {
            behavior: 'smooth',
            block: 'nearest'
        }
        if( dataLink === 'intro-wrap' ){
            options.block = 'end';
        }
        let elem = document.getElementById( dataLink );
        elem.scrollIntoView(options);
        //do section title fx
        $(elem).children('.title-cont').children().addClass('smooth-pulse');
        setTimeout(function(){
            $(elem).children('.title-cont').children().removeClass('smooth-pulse');
        }, 2000);
        
        
    });
    
});