/*
	Project Name : Gapminder Vizabi
	Version      : 0.13.6
	Author       : Abid Ali

	Details of functions implemented:
	All Chart		 : 06 function
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


							//*****************************All CHART*************************************

	/*
	*On large screen there is a side panel with color controls and list of countries
	*/

	//Bubble Chart

	it('LargeScreenBubbleChart', function(){

		browser.get("/tools/bubbles");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		//Clicking Expand
   	    var expand =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(7) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(expand), 5000);
		expand.click();


		// Getting attributes of color dropdown
		var colorOption = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div:nth-child(1) > div > div.vzb-dialog-title > span.vzb-caxis-selector"));
		browser.wait(EC.visibilityOf(colorOption), 5000);
		colorOption.getText().then(function (colorOptionAsParameter) {
			var colorOptionText = colorOptionAsParameter;
			console.log(colorOptionText);

			// Comparing the color option name
			var findMe = "World Region";
			expect(findMe).toBe(colorOptionText);
		});


		// Getting Afghnistan name under expanded find
		var afg = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div:nth-child(2) > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(1)"));
		browser.wait(EC.visibilityOf(afg), 5000);
		afg.getText().then(function (afgAsParameter) {
			var afgText = afgAsParameter;
			console.log(afgText);

			// Comparing the country name
			var findMeAfg = "Afghanistan";
			expect(findMeAfg).toBe(afgText);
		});


		// Getting attributes of size dropdown
		var sizeOption = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div:nth-child(3) > div > div.vzb-dialog-title > span.vzb-saxis-selector"));
		browser.wait(EC.visibilityOf(sizeOption), 5000);
		sizeOption.getText().then(function (sizeOptionAsParameter) {
			var sizeOptionText = sizeOptionAsParameter;
			console.log(sizeOptionText);

			// Comparing the size option name
			var findMeSizeOption = "Population";
			expect(findMeSizeOption).toBe(sizeOptionText);
		});

	});


//********************************************************************************************

	/*
	*On large screen there is a side panel with color controls and list of countries
	*/

	//Mountain Chart

	it('LargeScreenMountainChart', function(){

		browser.get("/tools/mountain");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		//Clicking Expand
   	    var expand =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(6) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(expand), 5000);
		expand.click();


		// Getting attributes of color dropdown
		var colorOption = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div:nth-child(1) > div > div.vzb-dialog-title > span.vzb-caxis-selector"));
		browser.wait(EC.visibilityOf(colorOption), 5000);
		colorOption.getText().then(function (colorOptionAsParameter) {
			var colorOptionText = colorOptionAsParameter;
			console.log(colorOptionText);

			// Comparing the color option name
			var findMe = "World Region";
			expect(findMe).toBe(colorOptionText);
		});


		// Getting Afghnistan name under expanded find
		var afg = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div:nth-child(2) > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(1)"));
		browser.wait(EC.visibilityOf(afg), 5000);
		afg.getText().then(function (afgAsParameter) {
			var afgText = afgAsParameter;
			console.log(afgText);

			// Comparing the country name
			var findMeAfg = "Afghanistan";
			expect(findMeAfg).toBe(afgText);
		});


		// Getting attributes of stack options
		var stackOption = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div:nth-child(3) > div > div.vzb-dialog-content.vzb-dialog-scrollable > form.vzb-howtostack.vzb-dialog-paragraph > label:nth-child(3) > span"));
		browser.wait(EC.visibilityOf(stackOption), 5000);
		stackOption.getText().then(function (stackOptionAsParameter) {
			var stackOptionText = stackOptionAsParameter;
			console.log(stackOptionText);

			// Comparing the stack option name
			var findMestackOption = "World";
			expect(findMestackOption).toBe(stackOptionText);
		});

	});


//********************************************************************************************

	/*
	*On large screen there is a side panel with color controls and list of countries
	*/

	//Bubble Map Chart

	it('LargeScreenBubbleMapChart', function(){

		browser.get("/tools/map");
		browser.wait(EC.visibilityOf(USABubbleMap), 60000 , "Chart is not Loaded");

		//Clicking Expand
   	    var expand =element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(5) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(expand), 5000);
		expand.click();


		// Getting attributes of color dropdown
		var colorOption = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div:nth-child(1) > div > div.vzb-dialog-title > span.vzb-caxis-selector"));
		browser.wait(EC.visibilityOf(colorOption), 5000);
		colorOption.getText().then(function (colorOptionAsParameter) {
			var colorOptionText = colorOptionAsParameter;
			console.log(colorOptionText);

			// Comparing the color option name
			var findMe = "World Region";
			expect(findMe).toBe(colorOptionText);
		});


		// Getting Afghnistan name under expanded find
		var afg = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div:nth-child(2) > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(1)"));
		browser.wait(EC.visibilityOf(afg), 5000);
		afg.getText().then(function (afgAsParameter) {
			var afgText = afgAsParameter;
			console.log(afgText);

			// Comparing the country name
			var findMeAfg = "Afghanistan";
			expect(findMeAfg).toBe(afgText);
		});


		// Getting attributes of size dropdown
		var sizeOption = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div:nth-child(3) > div > div.vzb-dialog-title > span.vzb-saxis-selector"));
		browser.wait(EC.visibilityOf(sizeOption), 5000);
		sizeOption.getText().then(function (sizeOptionAsParameter) {
			var sizeOptionText = sizeOptionAsParameter;
			console.log(sizeOptionText);

			// Comparing the size option name
			var findMeSizeOption = "Population";
			expect(findMeSizeOption).toBe(sizeOptionText);
		});

	});


//********************************************************************************************

	/*
	*
	*URL persistency: set time slider to some point, refresh,
	timeslider should keep the point you gave it, and chart should load at the state of that point

	*URL persistency: select a few entities, refresh, entities should be selected
	*/

	//Bubble Chart


	it('URLPersistencyBubbleChart', function() {
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
			//browser.sleep(5000);
		});

		//Clicking Pause
		browser.wait(EC.visibilityOf(pause), 5000).then(function(){
			pause.click();
		});


		//Dragging slider
		browser.actions().dragAndDrop(slider, {x:1000, y:0}).perform();
		browser.sleep(5000);

		//Taking First Screenshot before refreshing page
//		allure.createStep('Taking screenshots Before URL persistency', function () {
//		browser.takeScreenshot().then(function (png) {
//		allure.createAttachment('Before checking the URL persistency', function () {return new Buffer(png, 'base64')}, 'image/png')();
//			});
//		})();

		//Refreshing page
//		browser.refresh();
//		browser.sleep(5000);
	});



//********************************************************************************************

	/*
	*
	*URL persistency: set time slider to some point, refresh,
	timeslider should keep the point you gave it, and chart should load at the state of that point

	*URL persistency: select a few entities, refresh, entities should be selected
	*/

	//Mountain Chart


	it('URLPersistencyMountainChart', function() {
		browser.get("/tools/mountain");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		//Clicking find
		var find = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(find), 5000).then(function(){
			find.click();
		});
		// Place Text in Search
		var search = browser.element(by.css("#vzb-find-search"));
		browser.wait(EC.visibilityOf(search), 5000).then(function(){
			search.sendKeys("china");
		});
		//Clicking China
		var china = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(30) > label"));
		browser.wait(EC.visibilityOf(china), 5000).then(function(){
			china.click();
		});

		// Getting name from check box
		var chinaCheckBox = element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(30)"));
		browser.wait(EC.visibilityOf(chinaCheckBox), 5000);

		//Getting text from China check box
		chinaCheckBox.getText().then(function (chinaCheckBoxTextAsParameter) {
			var chinaCheckBoxText = chinaCheckBoxTextAsParameter;
			console.log(chinaCheckBoxText);

			// Clicking OK of Find pop up
			var ok = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary > span"));
			browser.wait(EC.visibilityOf(chinaCheckBox), 5000).then(function(){
				ok.click();
			});


			//Clicking play
			play.click();
			browser.sleep(5000);

			//clicking pause
			pause.click();
			browser.sleep(2000);


			//Taking First Screenshot before refreshing page
//			allure.createStep('Taking screenshots Before URL persistency', function () {
//			browser.takeScreenshot().then(function (png) {
//			allure.createAttachment('Before checking the URL persistency', function () {return new Buffer(png, 'base64')}, 'image/png')();
//				});
//			})();

			//Refreshing page
//			browser.refresh();
//			browser.sleep(5000);

		});
	});



//********************************************************************************************

	/*
	*
	*URL persistency: set time slider to some point, refresh,
	timeslider should keep the point you gave it, and chart should load at the state of that point

	*URL persistency: select a few entities, refresh, entities should be selected
	*/

	//Bubble Map Chart

	it('URLPersistencyBubbleMapChart', function() {
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

		//clicking ok
		var ok =element(by.css(
				"#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary > span"));
		browser.wait(EC.visibilityOf(ok), 5000).then(function(){
			ok.click();
		});

		//Clciking play
		play.click();
		browser.sleep(5000);

		//clicking pause
		pause.click();
		browser.sleep(2000);

		//Taking First Screenshot before refreshing page
//		allure.createStep('Taking screenshots Before URL persistency', function () {
//		browser.takeScreenshot().then(function (png) {
//		allure.createAttachment('Before checking the URL persistency', function () {return new Buffer(png, 'base64')}, 'image/png')();
//			});
//		})();

		//Refreshing page
//		browser.refresh();
//		browser.sleep(5000);
	});



});

		//*****************************END OF TEST SUITE FOR All CHART**************************************************
