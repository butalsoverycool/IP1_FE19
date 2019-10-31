/*
* INTERACTION JS
***************************/

/*const anchorScroll = function (elem) {
    let id = $(elem).attr('href');
    console.log('going to ' + id);
}*/

$(function () {
    console.log("interaction.js ready");

    /*
    * HIDE NAVBAR ON SCROLL
    **************************/
    const main = document.querySelector('main');
    const currentScrollPos = window.pageYOffset;

    let prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
        const currentScrollPos = window.pageYOffset;
        console.log('prev scroll-pos: ' + prevScrollpos);
        console.log('curren scroll-pos: ' + currentScrollPos);

        if (prevScrollpos > currentScrollPos || currentScrollPos < 51) {
            console.log('navbar visible');
            document.querySelector("nav").style.top = "0";
        } else {
            console.log('navbar hidden');
            document.querySelector("nav").style.top = "-50px";
        }
    }
    prevScrollpos = currentScrollPos;

    /*
    * AUDIO CONTROL
    ********************/

    //Create audio objects for each song
    Array.prototype.forEach.call(document.querySelectorAll('[data-song]'), function (song, index) {
        console.log('Audio object ' + (index + 1) + ' ready');
        // Create a new Audio object for the song
        song.audio = new Audio(song.href);

        // Add a11y attributes
        song.setAttribute('role', 'button');
        song.setAttribute('aria-pressed', 'false');
    });

    //Play/pause audio on click
    const playAudio = function (event) {

        // Ignore clicks on elements that aren't the song link
        if (!event.target.hasAttribute('data-song') && !event.target.closest('a').hasAttribute('data-song')) {
            return;
        }

        // Prevent link default, don't go to download-page
        event.preventDefault();


        // If the item is already playing, hit pause
        if (event.target.getAttribute('aria-pressed') == 'true') {
            event.target.audio.pause();
            event.target.setAttribute('aria-pressed', 'false');
            $(event.target).children('div').children('i').attr('class', 'fas fa-play');
            return;
        }



        $(event.target).children('div').children('i').attr('class', 'fas fa-pause');

        // Play the audio
        event.target.audio.play();
        event.target.setAttribute('aria-pressed', 'true');
    }

    /*
    * AUTOSCROLL
    *******************/
    const autoscroll = function (destinationId) {
        //scroll options
        let options = {
            behavior: 'smooth',
            block: 'nearest'
        }
        //if destination is intro, reach elem top
        if (destinationId === 'intro-wrap') {
            options.block = 'end';
        }

        //get the elem
        let destinationElem = document.getElementById(destinationId);
        destinationElem.scrollIntoView(options);

        //do some title fx at destination
        $(destinationElem).children('.title-cont').children().addClass('smooth-pulse');
        setTimeout(function () {
            $(destinationElem).children('.title-cont').children().removeClass('smooth-pulse');
        }, 2000);
    }


    /*
    * HANDLE ALL CLICKS ON PAGE
    ****************************/

    $(document).click(function (e) {
        //If nav-dropdown-list is open, auto-close on anywhere-click
        let navOpen = document.querySelector('#collapse-wrapper-nav')
            .classList.contains('show');
        if (navOpen) {
            $('.navbar-toggle').click();
        }

        //internal link? (autoscroll)
        if (e.target.hasAttribute('data-link')) {
            //send destination-id to autoscroll-func
            autoscroll(e.target.getAttribute('data-link'));
            return;
        }

        const isAudioChild = (child) => {
            var node = child.parentNode;
            while (node != null) {
                if (node.hasAttribute('data-song')) {
                    return { res: true, node: node };
                }
                node = node.parentNode;
            }
            return { res: false, node: null };
        }

        //audio?
        // If target points to child or grandchild, point to parent [data-song]-parent
        if (!e.target.hasAttribute('data-song') && isAudioChild(e.target).res) {
            e.target = isAudioChild(e.target).node;
        }
        if (e.target.hasAttribute('data-song')) {
            console.log('Clicked on audio');
            playAudio(e);
            return;
        }
    });


    /*
    * NOT ON LANDING PAGE
    ************************/

    //If not on landing page... (*edit when hosted)
    if (window.location.pathname !== '/index.html') {
        //Wrap logotype in link to landing page
        //$('.link_logotype').first().wrap('<a href="../index.html"></a>'); (*uncomment when hosted)

        //if on contact-made-page...
        if (window.location.pathname.includes('/contact-made/index.html')) {
            console.log(window.location.pathname);
            //for now...just hide/remove nav
            $('#theNav').html('');
            $('.navbar-toggle').css('display', 'none');

            $('.link_logotype').first().wrap('<a href="../index.html"></a>'); //(*remove when hosted)
        }
    }





    /*
    * CONTACT FORM VALIDATION
    ******************/

    $('form[name="contactForm"]').submit(function (e) {
        let formValid = true; // (until proof of crime!)
        let errors = [];

        //field-values
        const form = $('form[name="contactForm"]');
        let name = $('form[name="contactForm"] input[name="fName"]').val();
        let email = $('form[name="contactForm"] input[name="fEmail"]').val();
        let msg = $('form[name="contactForm"] textarea[name="fMsg"]').val();
        let ref = (() => { //iterate radios, find checked
            let checked = null;
            $('form[name="contactForm"] input[name="fRef"]').each(function () {
                if ($(this).prop('checked')) {
                    checked = $(this).val();
                }
            });
            return checked;
        })();

        //a just-in-case-regex-check
        const isValid = (input, regex) => {
            return regex.test(String(input).toLowerCase())
        }

        //expressions
        const casualRegExp = /^[a-z0-9åäöøæœàèìòùáéíóúýâêîôûãñõëïöüÿçß!"#€%&/()=?`+´,.@£$\n ]+$/i;
        const emailRegExp = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        if (!isValid(name, casualRegExp)) { //check name
            formValid = false;
            errors.push('Ditt namn innehåller otillåtna tecken.');
        }

        if (!isValid(email, emailRegExp)) { //check email
            formValid = false;
            errors.push('Din epostadress har ett ogiltigt format.');
        }

        if (!isValid(msg, casualRegExp)) { //check msg
            formValid = false;
            errors.push('Ditt meddelande innehåller otillåtna tecken.');
        } else { //convert textarea line breaks to html
            let lBreak = new RegExp('\n');
            msg = msg.replace(/\n/g, '<br/>');
        }

        if (!isValid(ref, casualRegExp)) { //check ref, just in case...
            formValid = false;
            errors.push('Något gick snett, ladda om sidan och prova igen.');
        }

        if (!formValid) { //if fail, no action, display collected errors
            e.preventDefault();

            let errorMsg = '';
            for (let x = 0; x < errors.length; x++) {
                errorMsg += `<p class="error">*** ${errors[x]} ***</p>`;
            }
            $('#contact-form .errorList').html(errorMsg);

            return;
        }

        //# # # # # - - - - - - # # # # #\\
        // # # # #  finish line  # # # # \\
        //# # # # # - - - - - - # # # # #\\
        //                               \\
        //                               \\

        //for now, just save valid values to sStorage 
        //and display them on success page
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('msg', msg);
        sessionStorage.setItem('ref', ref);
    });

});


/*
* Anim
*********************/

// Grow btns on focus
$('button, input.btn').on('focus', function () {
    $(this).addClass('in-focus');
});

$('button, input.btn').on('focusout', function () {
    $(this).removeClass('in-focus');
});


/*
* VIDEO
***********/

// Loads the YouTube IFrame API JavaScript code.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
// Inserts YouTube JS code into the page.
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

// onYouTubeIframeAPIReady() is called when the IFrame API is ready to go.
let videoHeight = $('.title-cont.overlay').first().height();
console.log(videoHeight);
function onYouTubeIframeAPIReady() {
    player = new YT.Player('pres-video-player', {
        height: '500',
        width: '500',
        videoId: 'pjo1Pt789Cs',
        playerVars: {
            'autoplay': 1,
            'disablekb': 1,
            'controls': 0,
            'modestbranding': 1,
            'showinfo': 0,
            'loop': 1,
            'rel': 0,
            'enablejsapi': 1,
            'wmode': 'transparent'
        },
        events: {
            'onReady': pkOnPlayerReady,
            'onStateChange': pkOnPlayerStateChange
        }
    });
}

function pkOnPlayerStateChange(e) {
    var frm = $(e.target.getIframe());
    if (e.data === YT.PlayerState.ENDED) {
        console.log('video ended');
        if ('player' === frm.attr('id')) {
            console.log('restarting video');
            player.playVideo();
        }
    }
    if (e.data === YT.PlayerState.BUFFERING) {
        if ('player' === frm.attr('id')) {
            e.target.setPlaybackQuality('hd720');
        }
    }
}
function pkOnPlayerReady(e) {
    player.mute();
    e.target.setPlaybackQuality('hd720');
}

//Load a youtube pixel
var pkEnableYoutube = function () {
    return;
    var deferred = jQuery.Deferred();
    var img = new Image();
    img.onload = function () { return deferred.resolve(); };
    img.onerror = function () { return deferred.reject(); };
    img.src = "../media/ge_upp_screenShot.jpg" + new Date().getTime();
    return deferred.promise();
};

//When the video starts to load, set a timer for the video wrap to fade in
jQuery(function ($) {
    $.when(pkEnableYoutube()).done(function () {
        setTimeout(function () {
            $('.video_wrap').fadeIn(1000);
        }, 500);
    });
});

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (iOS) {
    $('#pres-video-cont .video_wrap').html('').css('background', 'none');
    $('.link_logotype img').attr('src', 'media/de_la_mottez_logo.png');
}

//$('#logo-svg').attr('width', '100%').attr('height', '100%');