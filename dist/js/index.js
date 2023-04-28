'use strict'

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
        500: {
            slidesPerView: 2.2,
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
const tabBtns = document.querySelectorAll('.map__buttons-btn')
const mapIcons = document.querySelectorAll('.map-image-item')

let shopCount = 0
let restCount = 0
let targetCount = 0
let kindergartenCount = 0
let beatifulCount = 0 
let learningCount = 0

mapIcons.forEach(icon => {
    if (icon.dataset.type === 'shop') shopCount++
    if (icon.dataset.type === 'rest') restCount++
    if (icon.dataset.type === 'target') targetCount++
    if (icon.dataset.type === 'kindergarten') kindergartenCount++
    if (icon.dataset.type === 'shop') beatifulCount++
    if (icon.dataset.type === 'learning') learningCount++
})

tabBtns.forEach(tab => {
    if (tab.dataset.type === 'shop') tab.querySelector('.map__buttons-quantity').textContent = shopCount
    if (tab.dataset.type === 'rest') tab.querySelector('.map__buttons-quantity').textContent = restCount
    if (tab.dataset.type === 'target') tab.querySelector('.map__buttons-quantity').textContent = targetCount
    if (tab.dataset.type === 'kindergarten') tab.querySelector('.map__buttons-quantity').textContent = kindergartenCount
    if (tab.dataset.type === 'shop') tab.querySelector('.map__buttons-quantity').textContent = beatifulCount
    if (tab.dataset.type === 'learning') tab.querySelector('.map__buttons-quantity').textContent = learningCount
})

tabBtns.forEach(tab => {
    tab.addEventListener('mouseenter', (evt) => {
        const targetType = evt.target.dataset.type

        mapIcons.forEach(icon => {
            if (icon.dataset.type !== targetType && icon.dataset.type !== 'target') {
                icon.style.display = 'none'
            }
        })
    })

    tab.addEventListener('mouseleave', (evt) => {
        mapIcons.forEach(icon => {
                icon.style.display = ''
        })
    })
})