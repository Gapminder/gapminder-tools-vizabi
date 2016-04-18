/*
	Project Name : Gapminder Vizabi
	Version      : 0.13.6
	Author       : Abid Ali

	Details of functions implemented:
	Mountain Chart   : 05 functions
*/

describe('Web - Vizabi automated test', function() {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;

	var play = element(by.css("button.vzb-ts-btn-play.vzb-ts-btn"));
	var pause = element(by.css("button.vzb-ts-btn-pause.vzb-ts-btn"));
	var slider = element(by.css("#vizabi-placeholder >div > div.vzb-tool-stage > div.vzb-tool-timeslider > div > div.vzb-ts-slider-wrapper > svg.vzb-ts-slider > g > g.vzb-ts-slider-slide > circle"));
	var EC = protractor.ExpectedConditions;
	var USABubbleMap = element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)"));

	browser.manage().timeouts().pageLoadTimeout(90000);
//  browser.manage().window().setSize(1280, 1024);
//	browser.manage().window().setSize(800, 600);




							//**************************MOUNTAIN CHART*************************************

	/*
	 * Click "find" and check a few countries there, they should get selected on
	 * the visualization and their names should appear as a list on top left.
	 * Population should be displayed after the name.
	 */

	it('mountainFind', function() {

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

			// Getting atrributes of population
			var chinaBall = element(by.css("#chn-label > text:nth-child(3)"));
			browser.wait(EC.visibilityOf(chinaBall), 5000);

			//Getting text from china ball
			chinaBall.getText().then(function (chinaBallAsParameter) {
				var chinaBallText = chinaBallAsParameter;
				console.log(chinaBallText);

				//Getting country name from population
				var subStr = chinaBallText.substring(0, 5);
				console.log(subStr);

				//Getting population
				var population = chinaBallText.substring(7, 12);
				console.log(population);

				//Comparing population
				var givenPop = "1.38B";
				expect(givenPop).toBe(population);

				//Comparing country name
				expect(subStr).toBe(chinaCheckBoxText);
			});
		});
	});

//********************************************************************************************

	/*
	 * Click "show", check a few countries, you should get to see only these
	 * checked countries on the picture. (bad: you still see many other
	 * countries that are not checked, bad: you don't see anything)
	 */

	 it('showMountain', function() {
		browser.get("/tools/mountain");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		// Clicking show icon
		var show = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(4) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(show), 5000).then(function(){
			show.click();
		});

		// Giving the country name to search bar
		var search=browser.element(by.css("#vzb-show-search"));
		browser.wait(EC.visibilityOf(search), 5000).then(function(){
			search.sendKeys("china");
		});

		// Clicking the check box of china
		var checkBox = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(48) > label"));
		browser.wait(EC.visibilityOf(checkBox), 5000 , "Check box is not clicked").then(function(){
			checkBox.click();
		});

		//Removing text from search bar
		browser.wait(EC.visibilityOf(search), 5000).then(function(){
			search.clear();
		});

		// Giving second name to search bar
		browser.wait(EC.visibilityOf(search), 5000).then(function(){
			search.sendKeys("united states");
		});

		// Clicking the check box of USA
		var checkUSA = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(258) > label"));
		browser.wait(EC.visibilityOf(checkUSA), 5000).then(function(){
			checkUSA.click();
			browser.sleep(2000);
		});

		//Clicking OK of show pop up
		var ok = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary > span"));
		browser.wait(EC.visibilityOf(ok), 5000).then(function(){
			ok.click();
		});

		//Clicking find
		var find = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(find), 5000).then(function(){
			find.click();
		});

		// Check China Text Box
		var checkChn = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(1) > label"));
		browser.wait(EC.visibilityOf(checkChn), 5000).then(function(){
			checkChn.click();
		});

		//Getting China Text from check box field
		var chinaCheckBox = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(1)"));
		browser.wait(EC.visibilityOf(chinaCheckBox), 5000);
		chinaCheckBox.getText().then(function (chinaCheckBoxTextAsParameter) {
			var chinaCheckBoxText = chinaCheckBoxTextAsParameter;
			console.log(chinaCheckBoxText);


			//Getting China Text from population
			var chinaBall = element(by.css("#chn-label > text:nth-child(3)"));
			browser.wait(EC.visibilityOf(chinaBall), 5000);
			chinaBall.getText().then(function (chinaBallAsParameter) {
				var chinaBallText = chinaBallAsParameter;
				console.log(chinaBallText);

				//Getting country name from population
				var subStrChn = chinaBallText.substring(0, 5);
				console.log(subStrChn);

				// Check USA Text Box
				var checkUSA1 = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(2) > label"));
				browser.wait(EC.visibilityOf(checkUSA1), 5000).then(function(){
					checkUSA1.click();
				});

				//Getting USA Text from check box field
				var USACheckBoxText = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(2)"));
				browser.wait(EC.visibilityOf(USACheckBoxText), 5000);
					USACheckBoxText.getText().then(function (USACheckBoxTextAsParameter) {
					var USACheckBoxText = USACheckBoxTextAsParameter;
					console.log(USACheckBoxText);

					//Getting USA Text from population
					var usaBall = browser.element(by.css("#usa-label > text:nth-child(3)"));
					browser.wait(EC.visibilityOf(usaBall), 5000);
					usaBall.getText().then(function (usaBallAsParameter) {
						var usaBallText = usaBallAsParameter;
						console.log(usaBallText);

						//Getting country name from population
						var subStrUSA = usaBallText.substring(0, 13);
						console.log(subStrUSA);

						//Comparing China country name
						expect(subStrChn).toBe(chinaCheckBoxText);

						//Comparing USA country name
						expect(subStrUSA).toBe(USACheckBoxText);
					});
				});
			});
		});
	});

//********************************************************************************************

	/*
	 * in 2015, the percentage of people living in the extreme poverty should be
	 * 11.5 � 0.3%, and the world population should be 7.3B.
	 */

	 it('mountainSelect', function() {
		browser.get("/tools/mountain");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");


		// Getting year's 1st digit
		var firstDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(1)"));
		browser.wait(EC.visibilityOf(firstDigit), 5000);
		firstDigit.getText().then(function (firstDigitAsParameter) {
			var firstDigitText = firstDigitAsParameter;
			console.log(firstDigitText);

			// Comparing the year's 1st digit
			var firstDigitOfYear= "2";
			expect(firstDigitText).toBe(firstDigitOfYear);

			// Getting year's 2nd digit
			var secondDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(2)"));
			browser.wait(EC.visibilityOf(secondDigit), 5000);
			secondDigit.getText().then(function (secondDigitAsParameter) {
				var secondDigitText = secondDigitAsParameter;
				console.log(secondDigitText);

				// Comparing the year's 2nd digit
				var secondDigitOfYear= "0";
				expect(secondDigitText).toBe(secondDigitOfYear);

				// Getting year's 3rd digit
				var thirdDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(3)"));
				browser.wait(EC.visibilityOf(thirdDigit), 5000);
				thirdDigit.getText().then(function (thirdDigitAsParameter) {
					var thirdDigitText = thirdDigitAsParameter;
					console.log(thirdDigitText);

					// Comparing the year's 3rd digit
					var thirdDigitOfYear= "1";
					expect(thirdDigitText).toBe(thirdDigitOfYear);

					// Getting year's 4th digit
					var fourthDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(4)"));
					browser.wait(EC.visibilityOf(fourthDigit), 5000);
					fourthDigit.getText().then(function (fourthDigitAsParameter) {
						var fourthDigitText = fourthDigitAsParameter;
						console.log(fourthDigitText);

						// Comparing the year's 4th digit
						var fourthDigitOfYear= "5";
						expect(fourthDigitText).toBe(fourthDigitOfYear);

						// Clicking Options icon
						var options = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(5) > span.vzb-buttonlist-btn-icon.fa"));
						browser.wait(EC.visibilityOf(options), 5000).then(function(){
							options.click();
						});

						// Clicking X and Y
						var XandY = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-content.vzb-dialog-scrollable > div.vzb-accordion > div:nth-child(4) > div > div.vzb-dialog-title"));
						browser.wait(EC.visibilityOf(XandY), 5000).then(function(){
							XandY.click();
						});

						// Clicking probeline search bar
						var searchBar = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-content.vzb-dialog-scrollable > div.vzb-accordion > div.vzb-dialogs-dialog.vzb-moreoptions.vzb-accordion-section.vzb-accordion-active > div > div.vzb-dialog-content > div.vzb-probe-container > input"));
						browser.wait(EC.visibilityOf(searchBar), 5000).then(function(){
							searchBar.click();
						});
						// Getting text from probeline search bar
						searchBar.getAttribute('value').then(function (searchBarAsParameter) {
							var searchBarText = searchBarAsParameter;
							console.log(searchBarText);

							// Comparing value of probline search bar
							peakVal = "1.93";
							downVal = "1.64";
							expect(peakVal).toBeGreaterThan(searchBarText);
							expect(downVal).toBeLessThan(searchBarText);

							// Clicking Option pop up OK
							var optionsPopUpOk = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div"));
							browser.wait(EC.visibilityOf(optionsPopUpOk), 5000).then(function(){
								optionsPopUpOk.click();
							});

							// Clicking Stack
							var stack = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(3) > span.vzb-buttonlist-btn-icon.fa > svg"));
							browser.wait(EC.visibilityOf(stack), 5000).then(function(){
								stack.click();
							});
							// Clicking the world radio button
							var world = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-content.vzb-dialog-scrollable > form.vzb-howtomerge.vzb-dialog-paragraph > label:nth-child(4) > input[type=radio]"));
							browser.wait(EC.visibilityOf(world), 5000).then(function(){
								world.click();
							});
							// Clicking stack pop up OK
							var stackPopUpOk = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div"));
							browser.wait(EC.visibilityOf(stackPopUpOk), 5000).then(function(){
								stackPopUpOk.click();
							});
							//Clicking the curve of mountain
							var mountain = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-mountains"));
							browser.wait(EC.visibilityOf(mountain), 5000).then(function(){
								mountain.click();
							});
							// Getting atrributes of population
							var worldBall = element(by.css("#all-label > text:nth-child(3)"));
							browser.wait(EC.visibilityOf(worldBall), 5000);
							worldBall.getText().then(function (worldBallAsParameter) {
								var worldBallText = worldBallAsParameter;
								console.log(worldBallText);

								// Comparing the Check box country with selected country on the chart
								var subStr = worldBallText.substring(7, 11);
								console.log(subStr);
								var pop = "7.3B";
								expect(subStr).toBe(pop);
							});
						});
					});
				});
			});
		});
	});

//********************************************************************************************

	/*
	 * Uncheck the countries from "show", when the last one is unchecked, the
	 * picture should return to a default view = stacked shapes of all countries
	 */

		it('uncheckMountain', function() {
		browser.get("/tools/mountain");
		browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

		//Clicking Show icon
		var showIcon = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(4) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(showIcon), 5000).then(function(){
			showIcon.click();
		});
		//Clicking check box of Afghanistan
		var afg = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(2) > label"));
		browser.wait(EC.visibilityOf(afg), 5000).then(function(){
			afg.click();
			browser.sleep(2000);
		});
		//Clicking check box of Algeria
		var alg = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(5) > label"));
		browser.wait(EC.visibilityOf(alg), 5000).then(function(){
			alg.click();
			browser.sleep(2000);
		});

		//Clicking OK of show pop up
		var ok = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary > span"));
		browser.wait(EC.visibilityOf(ok), 5000).then(function(){
			ok.click();
		});

		//Clicking Show icon to uncheck the country
		browser.wait(EC.visibilityOf(showIcon), 5000).then(function(){
			showIcon.click();
		});
		//Unchecking Afghanistan
		browser.wait(EC.visibilityOf(afg), 5000).then(function(){
			afg.click();
			browser.sleep(2000);
		});

		//Unchecking Algeria
		browser.wait(EC.visibilityOf(alg), 5000).then(function(){
			alg.click();
			browser.sleep(2000);
		});

		//Clicking OK of show pop up
		browser.wait(EC.visibilityOf(ok), 5000).then(function(){
			ok.click();
		});

		//Clicking find
		var find = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa"));
		browser.wait(EC.visibilityOf(find), 5000).then(function(){
			find.click();
		});

		//Clicking Search bar of find
		var search = browser.element(by.css("#vzb-find-search"));
		browser.wait(EC.visibilityOf(search), 5000);

		//Entering China to searchbar
		browser.wait(EC.visibilityOf(search), 5000).then(function(){
			search.sendKeys("china");
		});

		// Check China Text Box
		var checkChn = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(30) > label"));
		browser.wait(EC.visibilityOf(checkChn), 5000).then(function(){
			checkChn.click();
		});

		//Getting China Terxt from check box field
		var chinaCheckBox = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(30)"));
		browser.wait(EC.visibilityOf(chinaCheckBox), 5000);
		chinaCheckBox.getText().then(function (chinaCheckBoxTextAsParameter) {
			var chinaCheckBoxText = chinaCheckBoxTextAsParameter;
			console.log(chinaCheckBoxText);

			//Getting China Terxt from population
			var chinaBall = element(by.css("#chn-label > text:nth-child(3)"));
			browser.wait(EC.visibilityOf(chinaBall), 5000);
			chinaBall.getText().then(function (chinaBallAsParameter) {
				var chinaBallText = chinaBallAsParameter;
				console.log(chinaBallText);

				//Getting country name from population
				var subStrChn = chinaBallText.substring(0, 5);
				console.log(subStrChn);

				//Removing text
				search.clear();

				//Entering USA to searchbar
				search.sendKeys("united states");

				//Clicking check box of USA
				var checkUSA = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(157) > label"));
				browser.wait(EC.visibilityOf(checkUSA), 5000).then(function(){
					checkUSA.click();
				});
				//Getting USA Text from check box field
				var USACheckBoxText = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(157)"));
				browser.wait(EC.visibilityOf(USACheckBoxText), 5000);
				USACheckBoxText.getText().then(function (USACheckBoxTextAsParameter) {
					var USACheckBoxText = USACheckBoxTextAsParameter;
					console.log(USACheckBoxText);

					//Getting USA Text from population
					var usaBall = browser.element(by.css("#usa-label > text:nth-child(3)"));
					browser.wait(EC.visibilityOf(usaBall), 5000);
					usaBall.getText().then(function (usaBallAsParameter) {
						var usaBallText = usaBallAsParameter;
						console.log(usaBallText);

						//Getting country name from population
						var subStrUSA = usaBallText.substring(0, 13);
						console.log(subStrUSA);

						//Comparing China country name
						expect(subStrChn).toBe(chinaCheckBoxText);

						//Comparing USA country name
						expect(subStrUSA).toBe(USACheckBoxText);
					});
				});
			});
		});
	});

//********************************************************************************************

	/*
	 * In 2015 there is roughly the same amount of people living in the extreme
	 * poverty as there was in 1800 (827 and 812 Millions). Hover the X Axis to
	 * check the number of people.
	 */

	 it('povertyPopulation', function() {
	  browser.get("/tools/mountain");
	  browser.wait(EC.visibilityOf(play), 60000 , "Chart is not Loaded");

	  // Getting year's 1st digit  at 2015
	  var firstDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(1)"));
	  browser.wait(EC.visibilityOf(firstDigit), 5000);
	  firstDigit.getText().then(function (firstDigitAsParameter) {
	 	 var firstDigitText = firstDigitAsParameter;
	 	 console.log(firstDigitText);

	 	 // Comparing the year's 1st digit
	 	 var firstDigitOfYear= "2";
	 	 expect(firstDigitText).toBe(firstDigitOfYear);

	 	 // Getting year's 2nd digit at 2015
	 	 var secondDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(2)"));
	 	 browser.wait(EC.visibilityOf(secondDigit), 5000);
	 	 secondDigit.getText().then(function (secondDigitAsParameter) {
	 		 var secondDigitText = secondDigitAsParameter;
	 		 console.log(secondDigitText);

	 		 // Comparing the year's 2nd digit
	 		 var secondDigitOfYear= "0";
	 		 expect(secondDigitText).toBe(secondDigitOfYear);

	 		 // Getting year's 3rd digit at 2015
	 		 var thirdDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(3)"));
	 		 browser.wait(EC.visibilityOf(thirdDigit), 5000);
	 		 thirdDigit.getText().then(function (thirdDigitAsParameter) {
	 			 var thirdDigitText = thirdDigitAsParameter;
	 			 console.log(thirdDigitText);

	 			 // Comparing the year's 3rd digit
	 			 var thirdDigitOfYear= "1";
	 			 expect(thirdDigitText).toBe(thirdDigitOfYear);


	 			 // Getting year's 4th digit at 2015
	 			 var fourthDigit = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(4)"));
	 			 browser.wait(EC.visibilityOf(fourthDigit), 5000);
	 			 fourthDigit.getText().then(function (fourthDigitAsParameter) {
	 				 var fourthDigitText = fourthDigitAsParameter;
	 				 console.log(fourthDigitText);

	 				 // Comparing the year's 4th digit
	 				 var fourthDigitOfYear= "5";
	 				 expect(fourthDigitText).toBe(fourthDigitOfYear);

	 				 // Hovering the poverty line at default place at 2015
	 				 var axis = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > rect"));
	 				 browser.wait(EC.visibilityOf(axis), 5000);
	 				 browser.actions().mouseMove(axis,{x:425,y:1}).perform();

	 				 // Getting attributes of poverty line at 2015
	 				 var line = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-probe"));
	 				 browser.wait(EC.visibilityOf(line), 5000);
	 				 line.getText().then(function (lineAsParameter) {
	 					 var lineText = lineAsParameter;
	 					 console.log(lineText);

	 					 //Getting population at 2015
	 					 var subStr = lineText.substring(12, 16);
	 					 console.log(subStr);

	 					 // Comparing the population at 2015
	 					 var peakVal = "828";
	 					 var downVal = "826";
	 					 expect(peakVal).toBeGreaterThan(subStr);
	 					 expect(downVal).toBeLessThan(subStr);

	 					 // Drag the Slider ball to 1800
	 					 var circle = browser.element(by.css("#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-timeslider > div > div.vzb-ts-slider-wrapper > svg.vzb-ts-slider > g > g.vzb-ts-slider-slide > circle"));
	 					 browser.wait(EC.visibilityOf(circle), 5000);
	 					 browser.actions().dragAndDrop(circle,{x:-1255,y:0}).perform();
						 browser.sleep(5000);

	 					 // Getting year's 1st digit  at 1800
	 					 firstDigit.getText().then(function (firstDigitAsParameter) {
	 						 var firstDigitText = firstDigitAsParameter;
	 						 console.log(firstDigitText);

	 						 // Comparing the year's 1st digit
	 						 var firstDigitOfYear1= "1";
	 						 expect(firstDigitText).toBe(firstDigitOfYear1);

	 						 // Getting year's 2nd digit at 1800
	 						 secondDigit.getText().then(function (secondDigitAsParameter) {
	 							 var secondDigitText = secondDigitAsParameter;
	 							 console.log(secondDigitText);

	 							 // Comparing the year's 2nd digit
	 							 var secondDigitOfYear1= "8";
	 							 expect(secondDigitText).toBe(secondDigitOfYear1);


	 							 // Getting year's 3rd digit at 1800
	 							 thirdDigit.getText().then(function (thirdDigitAsParameter) {
	 								 var thirdDigitText = thirdDigitAsParameter;
	 								 console.log(thirdDigitText);

	 								 // Comparing the year's 3rd digit
	 								 var thirdDigitOfYear1= "0";
	 								 expect(thirdDigitText).toBe(thirdDigitOfYear1);


	 								 // Getting year's 4th digit at 1800
	 								 fourthDigit.getText().then(function (fourthDigitAsParameter) {
	 									 var fourthDigitText = fourthDigitAsParameter;
	 									 console.log(fourthDigitText);

	 									 // Comparing the year's 4th digit
	 									 var fourthDigitOfYear1= "0";
	 									 expect(fourthDigitText).toBe(fourthDigitOfYear1);

	 									 // Hovering the poverty line at 1800
	 									 browser.actions().mouseMove(axis,{x:425,y:1}).perform();
										 browser.sleep(3000);


	 									 // Getting attributes of poverty line at 1800
	 									 line.getText().then(function (lineAsParameter1) {
	 										 var lineTextAfterDrag = lineAsParameter1;
	 										 console.log(lineTextAfterDrag);


	 										 //Getting population at 1800
	 										 var subStrAfterDrag = lineTextAfterDrag.substring(12, 16);
	 										 console.log(subStrAfterDrag);

	 										 // Comparing the population at 1800
	 										 var findMe = "812M";


	 										 // Comparing value of probline search bar
	 										 peakVal = "813";
	 										 downVal = "811";
	 										 expect(peakVal).toBeGreaterThan(subStrAfterDrag);
	 										 expect(downVal).toBeLessThan(subStrAfterDrag);


	 									 });
	 								 });
	 							 });
	 						 });
	 					 });
	 				 });
	 			 });

	 		 });
	 	 });
	  });
	 });


});



		//*****************************END OF TEST SUITE FOR MOUNTAIN CHART**************************************************
