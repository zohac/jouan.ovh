document.addEventListener('DOMContentLoaded', function () {

    $('.preloader-wrapper').detach();

    /**
     * Menu
     */
    var menu = document.querySelectorAll('.sidenav');
    var optionsMenu = {
        edge: 'right',
    };
    var instances = M.Sidenav.init(menu, optionsMenu);

    /**
     * Carousel
     */
    var elems = document.querySelectorAll('.carousel.carousel-slider');
    var options = {
        fullWidth: true,
        indicators: false,
        duration: 0,
    };
    var instance = M.Carousel.init(elems, options)[0];
    var carouselEltLength = $('.carousel-item').length;

    activeIndicatorItem();

    /**
     * Change the carousel an mousewheel
     */
    $('body').on('mousewheel DOMMouseScroll', function (event) {
        if (typeof event.originalEvent.detail == 'number' && event.originalEvent.detail !== 0) {
            handleMouseWheelDirection(-1 * event.originalEvent.detail);
        } else if (typeof event.originalEvent.wheelDelta == 'number') {
            handleMouseWheelDirection(event.originalEvent.wheelDelta);
        }
    });

    function handleMouseWheelDirection(event) {
        if (event > 0) {
            // Scroll Up
            instance.prev();
            $('.carousel-slider').children().removeClass('right left').addClass('left');
            activeIndicatorItem({
                nextId: -1
            });
        } else if (event < 0) {
            // Scroll Down
            instance.next();
            $('.carousel-slider').children().removeClass('right left').addClass('right');
            activeIndicatorItem({
                nextId: 1
            });
        }
    }

    /**
     * Change the active item for the indicator
     */
    function activeIndicatorItem(options = null) {

        var _defaults = {
            nextId: 0,
            selectedId: null
        };

        var activeIndicatorItem = $.extend({}, _defaults, options);
        var activeElt = $('.carousel-item.active').attr('id');
        var activeEltId = parseInt(activeElt.split("-")[1]) + activeIndicatorItem.nextId;

        if (activeIndicatorItem.selectedId === null) {
            if (activeEltId > carouselEltLength) {
                activeEltId = 1;
            } else if (activeEltId < 1) {
                activeEltId = carouselEltLength;
            }
        } else {
            activeEltId = activeIndicatorItem.selectedId;
        }
        $('.indicator-item.active').removeClass('active');
        $('#indicator-item-' + activeEltId).addClass('active');
    }

    /**
     * Define the carousel element by clicking on the indicator item
     */
    $('.indicator-item').on('click', function () {
        var id = parseInt($(this).attr('id').split("-")[2]);

        instance.set(id - 1);
        activeIndicatorItem({
            selectedId: id
        });
    });
    
    /**
     * Redirection to the selected url
     */
    $('.carousel-fixed-item').on('click', function () {
        var id = $('.carousel-item.active').attr('id');
        var url = {
            'item-1': 'http://chalet-et-caviar.zohac.fr/',
            'item-2': '#',
            'item-3': '#',
            'item-4': 'https://p5.jouan.ovh/',
            'item-5': 'https://p6.jouan.ovh/',
            'item-6': '#'
        };

        window.open(url[id],"_self")
    });
});