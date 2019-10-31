/*
* INTERACTION JS
***************************/


$(function () {
    const interactionJS = {};

    /*
    * AUTOCLOSE NAV
    ****************************/
    interactionJS.autoCloseNav = (() => {
        //If nav-dropdown-list is open, auto-close on anywhere-click
        let navOpen = document.querySelector('#collapse-wrapper-nav')
            .classList.contains('show');
        if (navOpen) {
            console.log('togggggggle')
            $('.navbar-toggle').click();
        }
    });


    /*
    * ON WINDOW SCROLL
    **************************/
    interactionJS.scroll = (() => {
        const nav = document.querySelector("nav");

        // standard pos -50px, bring out with class
        nav.style.top = '-50px';
        nav.classList.add('navShowing');

        // scroll pos
        let recentPos = window.pageYOffset;
        let newPos = window.pageYOffset;

        // event handler
        window.onscroll = () => {
            // CLOSE NAV DROPDOWN
            interactionJS.autoCloseNav();

            // HIDE NAVBAR
            // update scroll-pos
            newPos = window.pageYOffset;

            // on scrolling up: show nav, on scrolling down: hide
            if (recentPos > newPos || newPos < 51) {
                nav.classList.remove('navHidden');
                if (!nav.classList.contains('navShowing')) {
                    nav.classList.add('navShowing');
                }
                recentPos = newPos;
            } else {
                console.log('navbar hidden');
                nav.classList.remove('navShowing');
                if (!nav.classList.contains('navHidden')) {
                    nav.classList.add('navHidden');
                }
            }
            recentPos = newPos;
        }
    })(); //hide nav on scroll


    /*
    * AUDIO CONTROL
    ********************/
    interactionJS.audioControl = (() => {
        //Create audio objects for each song
        Array.prototype.forEach.call(document.querySelectorAll('[data-song]'), (song, index) => {
            // Create a new Audio object for the song
            song.audio = new Audio(song.href);

            // Add a11y attributes
            song.setAttribute('role', 'button');
            song.setAttribute('aria-pressed', 'false');
        });

        //Play/pause audio on click
        interactionJS.playAudio = (event) => {

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
    })(); // audio control


    /*
    * VIDEO CONTROL
    ********************/
    interactionJS.videoControl = (() => {
        // Loads the YouTube IFrame API JavaScript code.
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        // Inserts YouTube JS code into the page.
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;

        // onYouTubeIframeAPIReady() is called when the IFrame API is ready to go.
        let videoHeight = $('.title-cont.overlay').first().height();
        function onYouTubeIframeAPIReady() {
            let options = {
                'autoplay': 1,
                'disablekb': 1,
                'controls': 1,
                'modestbranding': 1,
                'showinfo': 0,
                'loop': 1,
                'rel': 0,
                'enablejsapi': 1,
                'wmode': 'transparent'
            };

            const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

            if (iOS) {
                $('#pres-video-cont .video_wrap').html('').css('background', 'none');
                $('.link_logotype img').attr('src', 'media/de_la_mottez_logo.png');
            }

            player = new YT.Player('pres-video-player', {
                height: '500',
                width: '500',
                videoId: 'pjo1Pt789Cs',
                playerVars: options,
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

    })(); // video control


    /*
    * INTERNAL LINK AUTOSCROLL
    *******************/
    interactionJS.autoscroll = ((destinationId) => {
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
    }); // autoscroll


    /*
    * CONTACT FORM VALIDATION
    ******************/
    interactionJS.formValidation = (() => {
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
    })(); // form validation


    /*
    * BUTTONS TO LINKS IF, NOT ON LANDING PAGE
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
    * HANDLE ALL CLICKS ON PAGE
    ****************************/

    $(document).click(function (e) {
        // close nav dropdown?
        interactionJS.autoCloseNav();

        //internal link? (autoscroll)
        if (e.target.hasAttribute('data-link')) {
            //send destination-id to autoscroll-func
            interactionJS.autoscroll(e.target.getAttribute('data-link'));
            return;
        }

        // custom func to tell if target el. is descending from an [data-song]-el.
        // (instead of using some smart closest- or find-func... XD )
        const isAudioChild = (child) => {
            var node = child.parentNode;
            while (node != null && (node.tagName === 'A' || node.tagName === 'DIV')) {
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
            interactionJS.playAudio(e);
            return;
        }
    });

    /*
    * Anim
    *********************/
    interactionJS.anim = (() => {
        // Grow btns on focus
        $('button, input.btn').on('focus', function () {
            $(this).addClass('in-focus');
        });

        $('button, input.btn').on('focusout', function () {
            $(this).removeClass('in-focus');
        });
    })();

    // log active funcs
    let active = [];
    for (let func in interactionJS) {
        active.push(func);
    }
    console.log('Interaction.js in da game', active);

}); // interaction-scope

