/*
* INTERACTION JS
***************************/

const anchorScroll = function (elem) {
    let id = $(elem).attr('href');
    console.log('going to ' + id);
}

    (function () {
        console.log("interaction.js ready");

        /*
        * NAV AND LINKS
        *******************/

        //Auto-close nav-dropdown-list on anywhere-click
        $(document).click(() => {
            let navOpen = $('.navbar-collapse')
                .hasClass('navbar-collapse flex-cont collapse show');
            if (navOpen) {
                $('.navbar-toggle').click();
            }
        });

        //Click on nav-link autoscrolls to elem
        $('.navbar-nav li span, .link_logotype, .booking-btn').click(function () {
            console.log($(this).attr('data-link'))
            let dataLink = $(this).attr('data-link');
            let options = {
                behavior: 'smooth',
                block: 'nearest'
            }
            if (dataLink === 'intro-wrap') {
                options.block = 'end';
            }
            let elem = document.getElementById(dataLink);
            elem.scrollIntoView(options);
            //do section title fx
            $(elem).children('.title-cont').children().addClass('smooth-pulse');
            setTimeout(function () {
                $(elem).children('.title-cont').children().removeClass('smooth-pulse');
            }, 2000);
        });


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
* Accessibility
*********************/

// Button-focus
$('button, input.btn').on('focus', function () {
    $(this).addClass('in-focus');
});

$('button, input.btn').on('focusout', function () {
    $(this).removeClass('in-focus');
});