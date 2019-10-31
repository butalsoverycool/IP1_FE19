/*
* ACCESSIBILITY JS
***************************/

// run but in local scope
(function () {
    'use strict';
    const accessibilityJS = {};

    // REMOVE NAVBAR TOGGLE BTN IF WHEN NOT NEEDED
    accessibilityJS.updateNavToggleBtn = (() => {
        const
            wide = window.outerWidth > 599 ? true : false,
            btn = document.querySelector('.navbar-toggle'),
            btnExists = btn !== null ? true : false;

        // if wide screen, delete btn if it exists
        // else if narrow screen, create btn if it doesn't exist  
        if (wide && btnExists) {
            btn.parentNode.removeChild(btn);
            console.log('removed toggle btn');
        } else if (!wide && !btnExists) {
            const newBtn =
                `<button type="button" class="navbar-toggle" data-toggle="collapse" data - target="#collapse-wrapper-nav" >
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button >`;
            document.querySelector('#navbar-toggle-container').innerHTML = newBtn;
            console.log('created toggle btn');
        }
    })();

    // list active funcs
    let funcs = [];
    for (let func in accessibilityJS) {
        funcs.push(func);
    }
    console.log('accessibility.js in da game', funcs);
})(); //local scope
