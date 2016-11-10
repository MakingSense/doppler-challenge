var PageTransitions = (function() {

	var $main = $( '#pt-main' ),
		$pages = $main.children( 'div.pt-page' ),
		$iterate = $( '.iterateEffects' ),
		$pulsable = $( '.pulsable' ),
		$pulsableBlack = $( '.pulsable-black' ),
		pagesCount = $pages.length,
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

		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );

		$pages.filter('.' + current).addClass( 'pt-page-current active' );

		$iterate.on( 'click', function() {
			var options = {};

			if( isAnimating ) {
				return false;
			}
			options.animation = $(this).attr('data-direction');
			options.showPage = $(this).attr('data-target');
			nextPage( options );
		} );

		$pulsable.on( 'click', function() {
			$(this).addClass('pulse');
		} );

		$pulsableBlack.on( 'click', function() {
			$(this).addClass('pulse-black');
		} );

	}

	function nextPage( options ) {
		var animation = options.animation;

		if( isAnimating ) {
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

		switch( animation ) {

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
				inClass = 'pt-page-moveFromBottom';
				break;
			case 'down':
				outClass = 'pt-page-moveToBottom active-out';
				inClass = 'pt-page-moveFromTop';
				break;

		}

		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}

	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current active' );
	}

	init();

	return {
		init : init,
		nextPage : nextPage,
	};

})();
