window.onload = function(){
	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$('source').empty();
	} else {
		$('img').empty();
	}
}

var PageTransitions = (function() {

	var $main = $( '#pt-main' ),
		$pages = $main.children( 'div.pt-page' ),
		$iterate = $( '.iterateEffects' ),
		$pulsable = $('.pulsable'),
		$email = $('#email-input'),
		$form = $('#email-form'),
		current = 'pt-page-home',
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;

	function init() {
		$pages.each(function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		});

		$pages.filter('.' + current).addClass( 'pt-page-current active' ).find('video')[0].play();

		$pulsable.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
			$(this).addClass('pulse');
		});

		$iterate.on('click', function() {
			var options = {};

			if (isAnimating) {
				return false;
			}

			options.animation = $(this).attr('data-direction');
			options.showPage = $(this).attr('data-target');
			nextPage( options );
		});

		$form.submit( function() {
			acceptEmail();
			return false;
		});

		$email.on('invalid', function() {
			if ($email[0].validity.typeMismatch || $email[0].validity.valueMissing) {
				$email[0].setCustomValidity(" ");
				$email.parent().addClass('error');
		  } else {
				$email.parent().removeClass('error');
				acceptEmail();
		  }
		});

	}

	function nextPage( options ) {
		var animation = options.animation;

		if (isAnimating) {
			return false;
		}

		isAnimating = true;

		var $currPage = $pages.filter('.' + current),
			$nextPage,
			outClass = '',
			inClass = '';

		if (options.showPage && !!$pages.filter('.' + options.showPage)[0]) {
			$nextPage = $pages.filter('.' + options.showPage).addClass( 'pt-page-current' );
			current = options.showPage;
		} else {
			$nextPage = $pages.filter('.pt-page-6').addClass( 'pt-page-current' );
			current = 'pt-page-6';
		}

		switch(animation) {
			case 'left':
				outClass = 'pt-page-moveToLeft active-out';
				inClass = 'pt-page-moveFromRight';
				break;
			case 'right':
				outClass = 'pt-page-moveToRight active-out';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 'up':
				outClass = 'pt-page-moveToTop active-out';
				inClass = 'pt-page-moveFromBottom .pt-page-delay700';
				break;
			case 'down':
				outClass = 'pt-page-moveToBottom active-out';
				inClass = 'pt-page-moveFromTop';
				break;
		}

		$currPage.addClass(outClass).on(animEndEventName, function() {
			$currPage.off(animEndEventName);
			endCurrPage = true;
			if (endNextPage) {
				onEndAnimation( $currPage, $nextPage );
			}
		});

		$nextPage.addClass(inClass).on(animEndEventName, function() {
			$nextPage.off(animEndEventName);
			$nextPage.find('video')[0].play();
			$currPage.find('.pulse').removeClass('pulse');
			endNextPage = true;
			if (endCurrPage) {
				onEndAnimation( $currPage, $nextPage );
			}
		});
	}

	function onEndAnimation($outpage, $inpage) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage($outpage, $inpage) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current active' );
		$outpage.find('video')[0].pause()
	}

	function acceptEmail() {
		$form.addClass('success');
		$email.val('');

		setTimeout(function(){
			$form.removeClass('success');
		}, 3000);
	}

	init();

	return {
		init : init,
		nextPage : nextPage,
	};

})();
