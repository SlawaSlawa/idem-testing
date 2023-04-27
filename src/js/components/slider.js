const swiper = new Swiper('.swiper', {
    slidesPerView: 3.7,
    spaceBetween: 121,
    navigation: {
        nextEl: '.feature__btns-item--next',
        prevEl: '.feature__btns-item--prev',
    },
    breakpoints: {
        280: {
            slidesPerView: 1.4,
            spaceBetween: 45,
        },
        768: {
            slidesPerView: 2.2,
            spaceBetween: 48,
        },
        1440: {
            slidesPerView: 3.7,
            spaceBetween: 134,
        }
    }
});
