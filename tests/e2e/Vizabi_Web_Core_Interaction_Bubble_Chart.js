/*
	Project Name : Gapminder Vizabi
	Version      : 0.13.6
	Author       : Abid Ali

	Details of functions implemented:
	Bubble Chart     : 13 functions
*/

describe('Web - Vizabi automated test', function() {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;

	var play = element(by.css("button.vzb-ts-btn-play.vzb-ts-btn"));
	var pause = element(by.css("button.vzb-ts-btn-pause.vzb-ts-btn"));
	var slider = element(by.css("#vizabi-placeholder >div > div.vzb-tool-stage > div.vzb-tool-timeslider > div > div.vzb-ts-slider-wrapper > svg.vzb-ts-slider > g > g.vzb-ts-slider-slide > circle"));
	var EC = protractor.ExpectedConditions;
	var USABubbleMap = element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)"));

	browser.manage().timeouts().pageLoadTimeout(90000);
//	browser.manage().window().setSize(1280, 1024);
//	browser.manage().window().setSize(800, 600);




							//*****************************BUBBLE CHART*************************************


/* If I select China and the United States bubbles and drag the timeslider,
	we see the trails being left for those two countries. */

/* If I select China and the United States bubbles and drag the timeslider,
	we see the trails being left for those two countries. */

	it('MakeTrialsDrag', function() {

		browser.get("/tools/bubbles");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		//Clicking USA bubble
		var USABubble = element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
		browser.wait(EC.visibilityOf(USABubble), 5000);
		browser.actions().dragAndDrop(USABubble,{x:0,y:-15}).click().perform();

		//Clicking China bubble
		var chinaBubble = element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-chn"));
		browser.wait(EC.visibilityOf(chinaBubble), 5000);
		browser.actions().dragAndDrop(chinaBubble, {x:0 , y:20}).click().perform();


		//Clicking play
		browser.wait(EC.visibilityOf(play), 5000).then(function(){
			play.click();
			browser.sleep(5000);
		});

		//Clicking Pause
		browser.wait(EC.visibilityOf(pause), 5000).then(function(){
			pause.click();
		});

		//Getting slider location before drag
		browser.wait(EC.visibilityOf(slider), 5000);
		slider.getLocation().then(function (beforePlaySliderLocation) {
			var beforePlaySliderDivLocation = beforePlaySliderLocation.x;
			console.log(beforePlaySliderDivLocation);

			//Dragging slider
			browser.actions().dragAndDrop(slider, {x:150, y:0}).perform();

			//Getting slider location after drag
			slider.getLocation().then(function (afterPlaySliderLocation) {
				var afterPlaySliderDivLocation = afterPlaySliderLocation.x;
				console.log(afterPlaySliderDivLocation);

				//Comparing slider locations
				expect(afterPlaySliderDivLocation).toBeGreaterThan(beforePlaySliderDivLocation);

			});
		});
	});

//********************************************************************************************


	/* If I click on play when I'm on the year 2015, the time slider handle
	  moves,, and the bubbles change position. It pauses automatically when it
	  reached the final year.
	 */

	it('Play', function() {
		browser.get("/tools/bubbles");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");


	  // Getting year's 1st digit
	  var firstDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(1)"));
	  browser.wait(EC.visibilityOf(firstDigit), 5000);
	  firstDigit.getText().then(function (firstDigitIntro) {
		  var firstDigitText = firstDigitIntro;
		  console.log(firstDigitText);

		  // Comparing the year's 1st digit
		  var val1= "2";
		  expect(firstDigitText).toBe(val1);


		  // Getting year's 2nd digit
		  var secondDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(2)"));
			  browser.wait(EC.visibilityOf(secondDigit), 5000);
			  secondDigit.getText().then(function (secondDigitIntro) {
			  var secondDigitText = secondDigitIntro;
			  console.log(secondDigitText);

			  // Comparing the year's 2nd digit
			  var val2= "0";
			  expect(secondDigitText).toBe(val2);


			  // Getting year's 3rd digit
			  var thirdDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(3)"));
			  browser.wait(EC.visibilityOf(thirdDigit), 5000);
			  thirdDigit.getText().then(function (thirdDigitIntro) {
				  var thirdDigitText = thirdDigitIntro;
				  console.log(thirdDigitText);

				  // Comparing the year's 3rd digit
				  var val3= "1";
				  expect(thirdDigitText).toBe(val3);


				  // Getting year's 4th digit
				  var fourthDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(4)"));
				  browser.wait(EC.visibilityOf(fourthDigit), 5000);
				  fourthDigit.getText().then(function (fourthDigitIntro) {
					  var fourthDigitText = fourthDigitIntro;
					  console.log(fourthDigitText);

					  // Comparing the year's 4th digit
					  var val4= "5";
					  expect(fourthDigitText).toBe(val4);


					  //Getting slider position before play
					  slider.getLocation().then(function (beforePlaySliderLocation) {
						  var beforePlaySliderDivLocation = beforePlaySliderLocation.x;
						  console.log(beforePlaySliderDivLocation);
						  play.click();
						  browser.sleep(75000);

						 //Getting slider position after play
						 slider.getLocation().then(function (afterPlaySliderLocation) {
						  var afterPlaySliderDivLocation = afterPlaySliderLocation.x;
						  console.log(afterPlaySliderDivLocation);

						  //Comparing drag positions
						  expect(afterPlaySliderDivLocation).toBe(beforePlaySliderDivLocation);
							});
						});
					});
				});
			});
		});
	});



//********************************************************************************************

	/* United states should have 2015: GDP: 53354 $/year/person
	 */

	it('GDP', function(){

	   browser.get("/tools/bubbles");
	   browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

	   //Hovering USA bubble
   	   var USABubble =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
	   browser.actions().dragAndDrop(USABubble,{x:0,y:-15}).click().perform();

	   //Unselecting the bubble to have hovering effect
		browser.actions().dragAndDrop(USABubble,{x:0,y:-15}).click().perform();

		// Getting attributes of X axis
		var axis = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-axis-x > g"));
		browser.wait(EC.visibilityOf(axis), 5000);
		axis.getText().then(function (axisAsParameter) {
			var axisText = axisAsParameter;
			console.log(axisText);

			// Comparing gdp
			var findMe = "53.4k";
			var gdp = axisText.substring(40, 45);
			console.log(gdp);
			expect(findMe).toBe(gdp);
		});
	});

//********************************************************************************************

/*
	 * User can hover the bubbles with a cursor,
	 * the bubbles react to hovering and a tooltip appears, and contains the country name
	 */

	it('USAHover', function(){

		browser.get("/tools/bubbles");
	   browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

	   //Hovering USA bubble
   	   var USABubble =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
	   browser.actions().dragAndDrop(USABubble,{x:0,y:-15}).click().perform();

	   //Unselecting the bubble to have hovering effect
	   browser.actions().dragAndDrop(USABubble,{x:0,y:-15}).click().perform();

		// Getting attributes of tooltip
		var tooltip = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-tooltip"));
		browser.wait(EC.visibilityOf(tooltip), 5000);
		tooltip.getText().then(function (tooltipAsParameter) {
			var tooltipText = tooltipAsParameter;
			console.log(tooltipText);

			// Comparing the country name
			var findMe = "United States";
			expect(findMe).toBe(tooltipText);

		});
	});

//********************************************************************************************

	/* There's a data warning to the bottom right
	 */

	it('DataWarning', function(){

	   browser.get("/tools/bubbles");
	   browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

	   //Clicking Data Warning link
	   var warning =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-data-warning > text"));
	   browser.wait(EC.visibilityOf(warning), 5000).then(function(){
			warning.click();
	    });

		//Getting text heading from data warning pop up
	   var warningTextElememnt =element(by.css("#vizabi-placeholder > div > div.vzb-tool-datawarning > div.vzb-data-warning-box > div.vzb-data-warning-link > div"));
	   browser.wait(EC.visibilityOf(warningTextElememnt), 5000);
	   warningTextElememnt.getText().then(function (warningTextAsParameter) {
			var warningText = warningTextAsParameter;
			console.log(warningText);

			// Comparing the heading text from pop up of data warning
			var findMe = "DATA DOUBTS";
			expect(findMe).toBe(warningText);

		});
	});


//********************************************************************************************

		/*
	 * I can drag the label "United States" and drop it anywhere in the chart
	 * area
	 */

	it('DragLabel', function(){

		browser.get("/tools/bubbles");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		//Clicking USA bubble
		var USABubble =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
		browser.wait(EC.visibilityOf(USABubble), 5000).then(function(){
			browser.actions().dragAndDrop(USABubble, {x: 0, y: -15}).click().perform();
		});

		//Getting location before dragging label
		var USALabel =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-labels > g > rect"));
		USALabel.getLocation().then(function(initialLocation){
			var initialLocationText = initialLocation.x;
			console.log(initialLocationText);
			browser.sleep(3000);

			// label drag and drop
			browser.wait(EC.visibilityOf(USALabel), 5000).then(function(){
				browser.actions().mouseMove(USALabel, {x: 0, y: 0}).perform();
				browser.sleep(3000);
				browser.actions().dragAndDrop(USALabel, {x: -100, y: 150}).click().perform();
				browser.sleep(2000);
			});

			//Getting location after dragging label
			USALabel.getLocation().then(function(finalLocationText){
				var finlLocationText = finalLocationText.x;
				console.log(finlLocationText);

				//Comparing label positions
				expect(initialLocationText).not.toEqual(finlLocationText);

			});
		});
	});

//********************************************************************************************


	/* I can select and deselect countries using the button "Find" to the right.*/


	it('Deselect',function(){


		browser.get("/tools/bubbles");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");


		//Clicking find
		var find =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(find), 5000).then(function(){
			find.click();
		});
		// Place Text in Search
		var search =element(by.css("#vzb-find-search"));
		browser.wait(EC.visibilityOf(search), 5000).then(function(){
			search.sendKeys("china");
		});

		// Check China Text Box
		var chinaBubble =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(37) > label"));
		browser.wait(EC.visibilityOf(chinaBubble), 5000).then(function(){
			chinaBubble.click();
		});
		// Remove Text
		search.clear();

		// Place Text in Search / Find Field
		browser.wait(EC.visibilityOf(search), 5000).then(function(){
			search.sendKeys("united states");
		});

		// Check United States Text Box
		var USABubble =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(184) > label"));
		browser.wait(EC.visibilityOf(USABubble), 5000).then(function(){
			USABubble.click();
		});
		// Remove Text
		search.clear();

		//Clicking OK
		var ok =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary > span"));
		browser.wait(EC.visibilityOf(ok), 5000).then(function(){
			ok.click();
		});

		// Getting USA opacity value
		var USA =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
		USA.getCssValue('opacity').then(function(USAOpacityAsParameter){
			var USAOpacity = USAOpacityAsParameter;
			console.log(USAOpacity);


			// Getting Nigeria Opacity value
			var nga =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-nga"));
			nga.getCssValue('opacity').then(function(NGAOpacityAsParameter){
				var NGAOpacity = NGAOpacityAsParameter;
				console.log(NGAOpacity);


				//Clicking find	again to deselect
				browser.wait(EC.visibilityOf(find), 5000).then(function(){
					find.click();
				});
				// Place Text in Search	again to deselect
				browser.wait(EC.visibilityOf(search), 5000).then(function(){
					search.sendKeys("china");
				});

				// Check China Text Box	again to deselect
				browser.wait(EC.visibilityOf(chinaBubble), 5000).then(function(){
					chinaBubble.click();
				});
				// Remove Text
				search.clear();

				// Place Text in Search / Find Field again to deselect
				browser.wait(EC.visibilityOf(search), 5000).then(function(){
					search.sendKeys("united states");
				});

				// Check United States Text Box	again to deselect
				browser.wait(EC.visibilityOf(USABubble), 5000).then(function(){
					USABubble.click();
				});
				// Remove Text
				search.clear();

				//Clicking OK
				browser.wait(EC.visibilityOf(ok), 5000).then(function(){
					ok.click();
				});
				// Comapring Opacities
				expect(NGAOpacity).toBeLessThan(USAOpacity);

			});
		});
	});

//********************************************************************************************

/*
	 * If I select a country, click "Lock", and drag the time slider or play,
	 * all unselected countries stay in place and only the selected one moves
	 */

	it('Lock',function(){

		browser.get("/tools/bubbles");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		// Selecting Country by giving country name in Find
		var find =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(find), 5000).then(function(){
			find.click();
		});

		// Giving country name in Search bar
		var search =element(by.css("#vzb-find-search"));
		browser.wait(EC.visibilityOf(search), 5000).then(function(){
			search.sendKeys("United States");
		});

		// Clicking Check box of USA
		var checkBox =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(184) > label"));
		browser.wait(EC.visibilityOf(checkBox), 5000).then(function(){
			checkBox.click();
		});

		// Remove text from search bar
		search.clear();

		// Click OK
		var OK =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary"));
		browser.wait(EC.visibilityOf(OK), 5000).then(function(){
			OK.click();
		});

		//Removing hovering effect
		var USBubble =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
		browser.actions().mouseMove(USBubble,{x:15, y:15}).perform();

		// Click Lock
		var lock =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(5) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(lock), 5000).then(function(){
			lock.click();
		});

		// Get co-ordinates of Slider ball
		var circle =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-timeslider > div > div.vzb-ts-slider-wrapper > svg > g > g.vzb-ts-slider-slide > circle"));
		circle.getLocation();

		// Getting USA size before play
		var USA =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
		USA.getCssValue('r').then(function(radius){
			var rad=radius;
			console.log(rad);

			// Click for Play
			play.click();
			browser.sleep(5000);

			//Clicking pause
			var pause =element(by.css("button.vzb-ts-btn-pause.vzb-ts-btn"));
			pause.click();

			// Getting USA size after play
			USA.getCssValue('r').then(function(finlRadiusParameter){
				var finalRadius=finlRadiusParameter;
				console.log(finalRadius);

				// Comapring sizes
				expect(rad).not.toEqual(finalRadius);
			});
		});
	});

//********************************************************************************************

	/*I can drag any panel on large screen resolutions if I drag the hand icon*/



	it('DragPanel',function(){

		browser.get("/tools/bubbles");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		// Selecting size icon
		var sizeIcon =element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(3) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(sizeIcon), 5000).then(function(){
			sizeIcon.click();
			browser.sleep(1000);
		});

		//Getting location of the panel before dargging
		var hand =element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-active.notransition.vzb-popup > div > span.thumb-tack-class.thumb-tack-class-ico-drag.fa > svg"));
		hand.getLocation().then(function (beforeDrag) {
			var bforDrag = beforeDrag;
			console.log(bforDrag);
			browser.sleep(2000);

			// Dragging the panel
			browser.actions().dragAndDrop(hand,{x:-150,y:100}).click().perform();

			//Getting location of the panel after dargging
			hand.getLocation().then(function (afterDrag) {
				var aftrDrag = afterDrag;
				console.log(aftrDrag);
				browser.sleep(2000);

				//Comparing positions
				expect(bforDrag).not.toEqual(aftrDrag);
			});
		});
	});

//********************************************************************************************

/*
	 * Clicking color should bring the panel. I can change the color of bubbles
	 * to GDP per capita and Child Mortality and Regions
	 */

	 it('ChangeColor',function(){

	 		browser.get("/tools/bubbles");
	 		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

	 		// Getting USA rgb value before changes
	 		var USA = element(by.css(
	 			"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
	 		browser.wait(EC.visibilityOf(play), 5000);
	 		USA.getCssValue('fill').then(function (bforchang) {
	 			var beforeChange = bforchang;
	 			console.log(beforeChange);

	 			// Clicking color icon
	 			var colorIcon = element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(1) > span.vzb-buttonlist-btn-icon.fa"));
	 			browser.wait(EC.visibilityOf(colorIcon), 5000).then(function(){
	 				colorIcon.click();
	 			});

	 			// Clicking dropDown
	 			var dropDown = element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-title > span.vzb-caxis-selector"));
	 			browser.wait(EC.visibilityOf(dropDown), 5000).then(function(){
	 				dropDown.click();
	 			});

	 			// Clicking search bar
	 			var search = element(by.css("#vzb-treemenu-search"));
	 			browser.wait(EC.visibilityOf(search), 5000).then(function(){
	 				search.click();
	 			});
	 			// Giving GDP in search bar
	 			search.sendKeys("GDP/capita");

	 			// Clicking GDP button
	 			var gdpButton = element(by.css(
	 					"#vizabi-placeholder > div > div.vzb-tool-treemenu > div.vzb-treemenu-wrap-outer.notransition.vzb-treemenu-abs-pos-vert.vzb-align-y-top.vzb-treemenu-abs-pos-horiz.vzb-align-x-left.vzb-treemenu-open-left-side > div > ul > li:nth-child(3) > span"));
	 			browser.wait(EC.visibilityOf(gdpButton), 5000).then(function(){
	 				gdpButton.click();
	 				browser.sleep(3000);
	 			});

	 			//Clicking OK for GDP\capita
	 			var OKgdpButton = element(by.css("#vizabi-placeholder > div > div.vzb-tool-treemenu > div.vzb-treemenu-wrap-outer.notransition.vzb-treemenu-abs-pos-vert.vzb-align-y-top.vzb-treemenu-abs-pos-horiz.vzb-align-x-left.vzb-treemenu-open-left-side > div > ul > li:nth-child(3) > div > div.vzb-treemenu-leaf.vzb-treemenu-leaf-button > div"));
	 			browser.wait(EC.visibilityOf(OKgdpButton), 5000).then(function(){
	 				OKgdpButton.click();
	 				browser.sleep(3000);
	 			});

	 			//Clicking OK for Color popup button
	 			var OKcolorButton = element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div"));
	 			browser.wait(EC.visibilityOf(OKcolorButton), 5000).then(function(){
	 				OKcolorButton.click();
	 				browser.sleep(3000);
	 			});

	 			// Getting USA rgb value after changes
	 			USA.getCssValue('fill').then(function (afterChangParameter) {
	 				var afterChange = afterChangParameter;
	 				console.log(afterChange);

	 				//Comparing color values
	 				expect(beforeChange).not.toEqual(afterChange);
	 			});
	 		});
	 	});

//********************************************************************************************

/* Clicking the bubble of the United States should select it. The bubble
	 * gets full opacity, while the other bubbles get lower opacity.
	 */

	it('opacity',function(){

		browser.get("/tools/bubbles");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		// Clicking the bubble of USA
		var USABubble = element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
		browser.wait(EC.visibilityOf(USABubble), 5000).then(function(){
			browser.actions().dragAndDrop(USABubble,{x:0,y:-15}).click().perform();
		});

		// Getting USA opacity value
		var USA = element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
		USA.getCssValue('opacity').then(function(USAOpacityAsParameter){
			var USAOpacity=USAOpacityAsParameter;
			console.log(USAOpacity);

			// Getting Nigeria Opacity value
			var nga = element(by.css(
					"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-nga"));
			nga.getCssValue('opacity').then(function(NGAOpacityAsParameter){
				var NGAOpacity=NGAOpacityAsParameter;
				console.log(NGAOpacity);

				//Comparing opacities
				expect(USAOpacity).not.toEqual(NGAOpacity);

			});
		});
	});

//********************************************************************************************

	/* The year appears on the background, un-cropped */

	it('backgroundyear',function(){

		browser.get("/tools/bubbles");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");


		// Getting year's 1st digit
		var firstDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(1)"));
		browser.wait(EC.visibilityOf(firstDigit), 5000);
		firstDigit.getText().then(function (firstDigitAsParameter) {
			var firstDigitText = firstDigitAsParameter;
			console.log(firstDigitText);

			// Comparing the year's 1st digit
			var firstDigitOfYear= "2";
			expect(firstDigitText).toBe(firstDigitOfYear);

			// Getting year's 2nd digit
			var secondDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(2)"));
			browser.wait(EC.visibilityOf(secondDigit), 5000);
			secondDigit.getText().then(function (secondDigitAsParameter) {
				var secondDigitText = secondDigitAsParameter;
				console.log(secondDigitText);

				// Comparing the year's 2nd digit
				var secondDigitOfYear= "0";
				expect(secondDigitText).toBe(secondDigitOfYear);

				// Getting year's 3rd digit
				var thirdDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(3)"));
				browser.wait(EC.visibilityOf(thirdDigit), 5000);
				thirdDigit.getText().then(function (thirdDigitAsParameter) {
					var thirdDigitText = thirdDigitAsParameter;
					console.log(thirdDigitText);

					// Comparing the year's 3rd digit
					var thirdDigitOfYear= "1";
					expect(thirdDigitText).toBe(thirdDigitOfYear);

					// Getting year's 4th digit
					var fourthDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(4)"));
					browser.wait(EC.visibilityOf(fourthDigit), 5000);
					fourthDigit.getText().then(function (fourthDigitAsParameter) {
						var fourthDigitText = fourthDigitAsParameter;
						console.log(fourthDigitText);

						// Comparing the year's 4th digit
						var fourthDigitOfYear= "5";
						expect(fourthDigitText).toBe(fourthDigitOfYear);
					});
				});
			});
		});
	});

//********************************************************************************************

/*
	 * I can unselect the bubble by clicking on the "x" of the label
	 * "United States", or by clicking on the bubble
	 */

	it('deselectByCross',function(){

		browser.get("/tools/bubbles");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		// Hovering the US bubble
		var USABubble = element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa"));
		browser.actions().dragAndDrop(USABubble,{x:0,y:-15}).click().perform();

		// Unselect country by clicking bubble
		browser.actions().dragAndDrop(USABubble,{x:0,y:-15}).click().perform();;

		// Select the US bubble again
		browser.actions().dragAndDrop(USABubble,{x:0,y:-15}).click().perform();

		// Unselect country by click
		var cross = element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-labels > g > g"));
		browser.wait(EC.visibilityOf(play), 5000);
		browser.actions().dragAndDrop(cross,{x:0,y:0}).click().perform();

	    // Getting USA opacity value
		USABubble.getCssValue('opacity').then(function(USAOpacityAsParameter){
			var USAOpacity=USAOpacityAsParameter;
			console.log(USAOpacity);

			//Value for comparing with opacity
			var findMe = 1 ;

			//Comparing opacities
			expect(USAOpacity).not.toEqual(findMe);
		});
	});

});
		//*****************************END OF TEST SUITE FOR BUBBLE CHART**************************************************
