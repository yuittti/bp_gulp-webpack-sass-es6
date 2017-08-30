import objectFitImages from 'object-fit-images';

// Polyfill object-fit/object-position
// npm object-fit-images
objectFitImages();

// jQuery is already included to the page
(function($){

	$(document).ready(() => {

		let $mobBtn = $('#btnMenuToggle'),
				$whitePage = $('.white-page');

		// Hamburger btn click handler
		$mobBtn.on('click', function (ev) {
				$(this).next('.menu').toggleClass('_opened');
				$('body').toggleClass('mobMenuOpened');
		});

		// Overlay background's click handler
		$whitePage.on('click', function (ev) {
			if ($('body').hasClass('mobMenuOpened')) {
				$mobBtn.next('.menu').toggleClass('_opened');
				$('body').toggleClass('mobMenuOpened');
			}
		});

		

		// save initial page width in data attr of document
		$(document).data('resize-width', $(document).width());
		
		// Handle mob menu view on window resize
		$(window).resize(resizeWidth);

		function resizeWidth() {
			let prevWidth = $(document).data('resize-width'),
					newWidth = $(document).width();

			if (prevWidth != newWidth) {
				responsive();
				$(document).data('resize-width', newWidth);
			}
		};

		function responsive() {
			if ($('body').hasClass('mobMenuOpened')) {
				$mobBtn.next('.menu').toggleClass('_opened');
				$('body').toggleClass('mobMenuOpened');
			}
		};
		
	})

})(jQuery);
