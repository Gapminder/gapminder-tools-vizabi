/*
	Project Name : Gapminder Vizabi
	Version      : 0.13.6
	Author       : Abid Ali

	Details of functions implemented:
	Bubble Map Chart : 09 functions
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


							//*****************************BUBBLE MAP*************************************

	/*
	 * I can select and deselect countries using the button "Find" to the right.
	 */


	it('findmap',function(){
		browser.get("/tools/map");
		browser.wait(EC.visibilityOf(USABubbleMap), 60000 , "Chart is not Loaded");

		//Clicking find
		var find =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(find), 5000).then(function(){
			find.click();
		});
		//Placing text in search field
		var search =element(by.css("#vzb-find-search"));
		browser.wait(EC.visibilityOf(search), 5000).then(function(){
			search.sendKeys("china");
		});

		// Check China Text Box
		var chinaBubble =element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(44) > label"));
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
		var USABubble =element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(240) > label"));
		browser.wait(EC.visibilityOf(USABubble), 5000).then(function(){
			USABubble.click();
		});

		// Remove Text
		search.clear();


		//clicking ok
		var ok =element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary > span"));
		browser.wait(EC.visibilityOf(ok), 5000).then(function(){
			ok.click();
		});

		// Getting USA opacity value
		var USA =element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)"));
		browser.wait(EC.visibilityOf(USA), 5000);
		USA.getCssValue('opacity').then(function(USAOpacityAsParameter){
			var USAOpacity = USAOpacityAsParameter;
			console.log(USAOpacity);

			// Getting Nigeria Opacity value
			var nga =element(by.css(
					"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(7)"));
			browser.wait(EC.visibilityOf(nga), 5000);
			nga.getCssValue('opacity').then(function(NGAOpacityAsParameter){
				var NGAOpacity = NGAOpacityAsParameter;
				console.log(NGAOpacity);

				// Comapring Opacities
				expect(NGAOpacity).toBeLessThan(USAOpacity);
			});
		});
	});

//**************************************************************************

	/*
	 * User can hover the bubbles with a cursor, the bubbles react to hovering
	 * and a tooltip appears, and contains the country name.
	 */

	it('hoverMap', function(){

		browser.get("/tools/map");
		browser.wait(EC.visibilityOf(USABubbleMap), 60000 , "Chart is not Loaded");

		// Hovering the China Bubble
		var china = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(1)"));
		browser.wait(EC.visibilityOf(china), 5000);
		browser.actions().mouseMove(china).perform();
		var findMe = "China";

		// Getting attributes of Tooltip
		var tooltip = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-tooltip"));
		browser.wait(EC.visibilityOf(tooltip), 5000);
		tooltip.getText().then(function (tooltipAsParameter) {
			var tooltipText = tooltipAsParameter;
			console.log(tooltipText);

			// Comparing the country name
			expect(tooltipText).toBe(findMe);
		});
	});

//*****************************************************************

	/*
	 * Clicking the bubble of the United States should select it. The bubble
	 * gets full opacity, while the other bubbles get lower opacity.
	 */

	it('opacityMap',function(){
		browser.get("/tools/map");
		browser.wait(EC.visibilityOf(USABubbleMap), 60000 , "Chart is not Loaded");

		// Clicking the bubble of USA
		var USABubble = element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)"));
		browser.wait(EC.visibilityOf(USABubble), 5000).then(function(){
			USABubble.click();
		});

		// Getting USA opacity value
		var USA = element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)"));
		browser.wait(EC.visibilityOf(USA), 5000);
		USA.getCssValue('opacity').then(function(USAOpacityAsParameter){
			var USAOpacity=USAOpacityAsParameter;
			console.log(USAOpacity);

			// Getting Nigeria Opacity value
			var nga = element(by.css(
					"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(7)"));
			browser.wait(EC.visibilityOf(nga), 5000);
			nga.getCssValue('opacity').then(function(NGAOpacityAsParameter){
				var NGAOpacity=NGAOpacityAsParameter;
				console.log(NGAOpacity);


				// Comparing the opacities
				expect(USAOpacity).not.toEqual(NGAOpacity);
			});
		});
	});

//*********************************************************************************************

	/*
	 * I can drag the label "United States" and drop it anywhere in the chart
	 * area
	 */

	it('DragLabelMap', function(){
		browser.get("/tools/map");
		browser.wait(EC.visibilityOf(USABubbleMap), 60000 , "Chart is not Loaded");

		//Clicking USA bubble
		var USABubble =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)"));
		browser.wait(EC.visibilityOf(USABubble), 5000).then(function(){
			USABubble.click();
		});
		//Getting tooltip text before drag
		var USALabel =element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-labels > g > rect"));
		browser.wait(EC.visibilityOf(USALabel), 5000);
		USALabel.getLocation().then(function(initiallocation){
			var initialLocationText = initiallocation.x;
			console.log(initialLocationText);

			//Dragging tooltip
			browser.actions().dragAndDrop(USALabel, {x: -100, y: 150}).click().perform();
			browser.sleep(2000);

			//Getting tooltip text after drag
			USALabel.getLocation().then(function(finalLocationText){
				var finlocation = finalLocationText.x;
				console.log(finlocation);

				//Comparing tooltip positios
				expect(initialLocationText).not.toEqual(finalLocationText);
			});
		});
	});

//**************************************************************************

	/*
	 * I can unselect the bubble by clicking on the "x" of the label
	 * "United States", or by clicking on the bubble
	 */

	it('crossLabelMap',function(){
		browser.get("/tools/map");
		browser.wait(EC.visibilityOf(USABubbleMap), 60000 , "Chart is not Loaded");

		// Clicking the US bubble
		var USABubble = element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)"));
		browser.wait(EC.visibilityOf(USABubble), 5000).then(function(){
			USABubble.click();
		});

		//Unselectiong the US bubble by clikcing bubble
		browser.wait(EC.visibilityOf(USABubble), 5000).then(function(){
			USABubble.click();
		});

		// Clicking the US bubble again
		browser.wait(EC.visibilityOf(USABubble), 5000).then(function(){
			USABubble.click();
		});

		//Hovering the label to get cross
		var tooltip= element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-labels > g > rect"));
		browser.wait(EC.visibilityOf(tooltip), 5000);
		browser.actions().mouseMove(tooltip).perform();

		// Unselect country by click
		var cross = element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-labels > g > g"));
		browser.wait(EC.visibilityOf(cross), 5000);
		browser.actions().mouseMove(cross).click().perform();

	});

//********************************************************************************************

	/*
	 * bubbles react on hover
	 */

	 it('BubbleMapHover', function() {
		browser.get("/tools/map");
		browser.wait(EC.visibilityOf(USABubbleMap), 60000 , "Chart is not Loaded");

		// Hovering the China Bubble
		var china = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(1)"));
		browser.wait(EC.visibilityOf(china), 5000);
		browser.actions().mouseMove(china).perform();

		// Getting attributes of Tooltip
		var tooltip = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-tooltip"));
		browser.wait(EC.visibilityOf(tooltip), 5000);
		tooltip.getText().then(function (tooltipAsParameter) {
			var tooltipText = tooltipAsParameter;
			console.log(tooltipText);

			// Comparing the country name
			var findMe = "China";
			expect(tooltipText).toBe(findMe);

		});
	});

//********************************************************************************************

	/*
	 * The bubbles change size with timeslider drag and play
	 */

	it('BubbleMapdrag', function() {
		browser.get("/tools/map");
		browser.wait(EC.visibilityOf(USABubbleMap), 60000 , "Chart is not Loaded");

		//USA bubble element
		var USA = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)"));
		browser.wait(EC.visibilityOf(USA), 5000);

		//Bubble size before play
		USA.getCssValue("r").then(function (USAAsParameter) {
			var heightBefore = USAAsParameter;
			console.log("Bubble Size before play ");
			console.log(heightBefore);

			//Clicking play
			browser.wait(EC.visibilityOf(play), 5000).then(function(){
			play.click();
				browser.sleep(3000);
			});

			//Clicking pause
			var pause = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-timeslider > div > div.vzb-ts-btns > button.vzb-ts-btn-pause.vzb-ts-btn > svg"));
			browser.wait(EC.visibilityOf(pause), 5000).then(function(){
				pause.click();
			});

			//Bubble size after play ang before drag
			USA.getCssValue("r").then(function (USAAsParameter1) {
				var heightAfter = USAAsParameter1;
				console.log("Bubble size after play ang before drag");
				console.log(heightAfter);

				//Comparing sizes
				expect(heightBefore).not.toEqual(heightAfter);

				//Getting the location of slider ball before darg
				slider.getLocation().then(function (sliderAsParameter) {
					var positionBefore = sliderAsParameter.x;
					console.log("Slider Location before Drag");
					console.log(positionBefore);

					//Dragging the slider ball
					browser.actions().dragAndDrop(slider,{x:500,y:0}).perform();

					//Bubble size after drag
					USA.getCssValue("r").then(function (USAAsParameter11) {
						var heightAfterDrag = USAAsParameter11;
						console.log("Bubble size after Drag");
						console.log(heightAfter);

						//Comparing sizes
						expect(heightAfterDrag).not.toEqual(heightAfter);

						//Getting the location of slider ball after drag
						slider.getLocation().then(function (sliderAsParameter1) {
							var positionAfter = sliderAsParameter1.x;
							console.log("Slider Location after Drag");
							console.log(positionAfter);


							//Comparing slider position
							expect(positionBefore).toBeLessThan(positionAfter);

						});
					});
				});
			});
		});
	});

//********************************************************************************************

	/*
	 * the size is according to the scale
	 */

	it('scale', function() {
		browser.get("/tools/map");
		browser.wait(EC.visibilityOf(USABubbleMap), 60000 , "Chart is not Loaded");

		//USA bubble element
		var USA = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)"));
		browser.wait(EC.visibilityOf(USA), 5000);

		// Clicking size icon
		var size = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(3) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(size), 5000).then(function(){
			size.click();
		});

		//Bubble size before dargging
		USA.getSize().then(function (USAAsParameter) {
			var heightBefore = USAAsParameter.height;
			console.log(heightBefore);

			// dargging minimum pointer to the maximum
			var sliderOfSize = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content > div > div > svg > g > g > g.resize.w.vzb-bs-slider-thumb > g"));
			browser.wait(EC.visibilityOf(sliderOfSize), 5000);
			browser.actions().dragAndDrop(sliderOfSize,{x:100,y:0}).perform();

			//Bubble size after dargging
			USA.getSize().then(function (USAAsParameter1) {
				var heightAfter = USAAsParameter1.height;
				console.log(heightAfter);

				//clicking OK
				var ok = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons"));
				browser.wait(EC.visibilityOf(ok), 5000);

				//Comparing sizes
				expect(heightBefore).toBeLessThan(heightAfter);

			});
		});
	});

//********************************************************************************************

	/*
	 * While hovering, the chart title changes to show the exact values.
	 */

	it('hoverValueMap', function() {
		browser.get("/tools/map");
		browser.wait(EC.visibilityOf(USABubbleMap), 60000 , "Chart is not Loaded");

		//Hovering USA bubble element
		var USA = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)"));
		browser.wait(EC.visibilityOf(USA), 5000);
		browser.actions().mouseMove(USA).perform();

		// Getting attributes of population
		var population = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-axis-y-title"));
		browser.wait(EC.visibilityOf(population), 5000);
		population.getText().then(function (populationAsParameter) {
			var populationText = populationAsParameter;
			console.log(populationText);

			// Comparing the population
			var findMe = "322M";
			var populationInMillion = populationText.substring(6, 10);
			console.log(populationInMillion);
			expect(findMe).toBe(populationInMillion);
		});
	});


});

		//*****************************END OF TEST SUITE FOR BUBBLE MAP CHART**************************************************
