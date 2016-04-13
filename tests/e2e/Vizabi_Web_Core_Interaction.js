/*
 Project Name : Gapminder Vizabi
 Version      : 0.12.7
 Author       : Abid Ali

 Details of functions implemented:
 Bubble Chart     : 13 functions
 Mountain Chart   : 05 functions
 Bubble Map Chart : 09 functions
 */

describe('Web - Vizabi automated test', function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var play = element(by.css('button.vzb-ts-btn-play.vzb-ts-btn'));
  var pause = element(by.css('button.vzb-ts-btn-pause.vzb-ts-btn'));
  var slider = element(by.css('#vizabi-placeholder >div > div.vzb-tool-stage > div.vzb-tool-timeslider > div > div.vzb-ts-slider-wrapper > svg.vzb-ts-slider > g > g.vzb-ts-slider-slide > circle'));
  var EC = protractor.ExpectedConditions;
  var USABubbleMap = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)'));

  browser.manage().timeouts().pageLoadTimeout(90000);
  browser.manage().window().setSize(1280, 800);


  //*****************************BUBBLE CHART*************************************




  /* If I select China and the United States bubbles and drag the timeslider,
   we see the trails being left for those two countries. */

  it('MakeTrialsDrag', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    //Clicking USA bubble
    var USABubble = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa'));
    browser.wait(EC.visibilityOf(USABubble), 5000);
    browser.actions().dragAndDrop(USABubble, {x:0, y:-15}).click().perform();

    //Clicking China bubble
    var chinaBubble = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-chn'));
    browser.wait(EC.visibilityOf(chinaBubble), 5000);
    browser.actions().dragAndDrop(chinaBubble, {x:0, y:20}).click().perform();


    //Clicking play
    browser.wait(EC.visibilityOf(play), 5000).then(function() {
      play.click();
      browser.sleep(5000);
    });

    //Clicking Pause
    browser.wait(EC.visibilityOf(pause), 5000).then(function() {
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
    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');


    // Getting year's 1st digit
    var firstDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(1)'));
    browser.wait(EC.visibilityOf(firstDigit), 5000);
    firstDigit.getText().then(function (firstDigitIntro) {
      var firstDigitText = firstDigitIntro;
      console.log(firstDigitText);

      // Comparing the year's 1st digit
      var val1 = '2';
      expect(firstDigitText).toBe(val1);


      // Getting year's 2nd digit
      var secondDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(2)'));
      browser.wait(EC.visibilityOf(secondDigit), 5000);
      secondDigit.getText().then(function (secondDigitIntro) {
        var secondDigitText = secondDigitIntro;
        console.log(secondDigitText);

        // Comparing the year's 2nd digit
        var val2 = '0';
        expect(secondDigitText).toBe(val2);


        // Getting year's 3rd digit
        var thirdDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(3)'));
        browser.wait(EC.visibilityOf(thirdDigit), 5000);
        thirdDigit.getText().then(function (thirdDigitIntro) {
          var thirdDigitText = thirdDigitIntro;
          console.log(thirdDigitText);

          // Comparing the year's 3rd digit
          var val3 = '1';
          expect(thirdDigitText).toBe(val3);


          // Getting year's 4th digit
          var fourthDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(4)'));
          browser.wait(EC.visibilityOf(fourthDigit), 5000);
          fourthDigit.getText().then(function (fourthDigitIntro) {
            var fourthDigitText = fourthDigitIntro;
            console.log(fourthDigitText);

            // Comparing the year's 4th digit
            var val4 = '5';
            expect(fourthDigitText).toBe(val4);


            //Getting slider position before play
            slider.getLocation().then(function (beforePlaySliderLocation) {
              var beforePlaySliderDivLocation = beforePlaySliderLocation.x;
              console.log(beforePlaySliderDivLocation);

              play.click();
              browser.sleep(76000);

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

  it('GDP', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    //Hovering USA bubble
    var USABubble = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa'));
    browser.actions().mouseMove(USABubble, {x:10, y:10}).perform();

    // Getting attributes of X axis
    var axis = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-axis-x > g'));
    browser.wait(EC.visibilityOf(axis), 5000);
    axis.getText().then(function (axisAsParameter) {
      var axisText = axisAsParameter;
      console.log(axisText);

      // Comparing gdp
      var findMe = '53354';
      var gdp = axisText.substring(47, 52);
      console.log(gdp);
      expect(findMe).toBe(gdp);
    });
  });

  //********************************************************************************************

  /*
   * User can hover the bubbles with a cursor,
   * the bubbles react to hovering and a tooltip appears, and contains the country name
   */

  it('USAHover', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    //Hovering USA bubble
    var USABubble = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa'));
    browser.actions().dragAndDrop(USABubble, {x:0, y:20}).click().click().perform();

    // Getting attributes of tooltip
    var tooltip = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-tooltip'));
    browser.wait(EC.visibilityOf(tooltip), 5000);
    tooltip.getText().then(function (tooltipAsParameter) {
      var tooltipText = tooltipAsParameter;
      console.log(tooltipText);

      // Comparing the country name
      var findMe = 'United States';
      expect(findMe).toBe(tooltipText);

    });
  });

  //********************************************************************************************

  /* There's a data warning to the bottom right
   */

  it('DataWarning', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    //Clicking Data Warning link
    var warning = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-data-warning > text'));
    browser.wait(EC.visibilityOf(warning), 5000).then(function() {
      warning.click();
    });

    //Getting text heading from data warning pop up
    var warningTextElememnt = element(by.css('#vizabi-placeholder > div > div.vzb-tool-datawarning > div.vzb-data-warning-box > div.vzb-data-warning-link > div'));
    browser.wait(EC.visibilityOf(warningTextElememnt), 5000);
    warningTextElememnt.getText().then(function (warningTextAsParameter) {
      var warningText = warningTextAsParameter;
      console.log(warningText);

      // Comparing the heading text from pop up of data warning
      var findMe = 'DATA DOUBTS';
      expect(findMe).toBe(warningText);

    });
  });


  //********************************************************************************************

  /*
   * I can drag the label "United States" and drop it anywhere in the chart
   * area
   */

  it('DragLabel', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    //Clicking USA bubble
    var USABubble = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa'));
    browser.wait(EC.visibilityOf(USABubble), 5000).then(function() {
      browser.actions().dragAndDrop(USABubble, {x: 0, y: -15}).click().perform();
    });

    //Getting location before dragging label
    var USALabel = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-labels > g > rect'));
    USALabel.getLocation().then(function(initialLocation) {
      var initialLocationText = initialLocation.x;
      console.log(initialLocationText);
      browser.sleep(3000);

      // label drag and drop
      browser.wait(EC.visibilityOf(USALabel), 5000).then(function() {
        browser.actions().mouseMove(USALabel, {x: 0, y: 0}).perform();
        browser.sleep(3000);
        browser.actions().dragAndDrop(USALabel, {x: -100, y: 150}).click().perform();
        browser.sleep(2000);
      });

      //Getting location after dragging label
      USALabel.getLocation().then(function(finalLocationText) {
        var finlLocationText = finalLocationText.x;
        console.log(finlLocationText);

        //Comparing label positions
        expect(initialLocationText).not.toEqual(finlLocationText);

      });
    });
  });

  //********************************************************************************************


  /* I can select and deselect countries using the button "Find" to the right.*/


  it('Deselect', function() {


    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');


    //Clicking find
    var find = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(find), 5000).then(function() {
      find.click();
    });
    // Place Text in Search
    var search = element(by.css('#vzb-find-search'));
    browser.wait(EC.visibilityOf(search), 5000).then(function() {
      search.sendKeys('china');
    });

    // Check China Text Box
    var chinaBubble = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(37) > label'));
    browser.wait(EC.visibilityOf(chinaBubble), 5000).then(function() {
      chinaBubble.click();
    });
    // Remove Text
    search.clear();

    // Place Text in Search / Find Field
    browser.wait(EC.visibilityOf(search), 5000).then(function() {
      search.sendKeys('united states');
    });

    // Check United States Text Box
    var USABubble = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(188) > label'));
    browser.wait(EC.visibilityOf(USABubble), 5000).then(function() {
      USABubble.click();
    });
    // Remove Text
    search.clear();

    //Clicking OK
    var ok = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary > span'));
    browser.wait(EC.visibilityOf(ok), 5000).then(function() {
      ok.click();
    });

    // Getting USA opacity value
    var USA = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > g.vzb-bc-entity.trail-usa > g:nth-child(216)'));
    USA.getCssValue('opacity').then(function(USAOpacityAsParameter) {
      var USAOpacity = USAOpacityAsParameter;
      console.log(USAOpacity);


      // Getting Nigeria Opacity value
      var nga = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-nga'));
      nga.getCssValue('opacity').then(function(NGAOpacityAsParameter) {
        var NGAOpacity = NGAOpacityAsParameter;
        console.log(NGAOpacity);


        //Clicking find	again to deselect
        browser.wait(EC.visibilityOf(find), 5000).then(function() {
          find.click();
        });
        // Place Text in Search	again to deselect
        browser.wait(EC.visibilityOf(search), 5000).then(function() {
          search.sendKeys('china');
        });

        // Check China Text Box	again to deselect
        browser.wait(EC.visibilityOf(chinaBubble), 5000).then(function() {
          chinaBubble.click();
        });
        // Remove Text
        search.clear();

        // Place Text in Search / Find Field again to deselect
        browser.wait(EC.visibilityOf(search), 5000).then(function() {
          search.sendKeys('united states');
        });

        // Check United States Text Box	again to deselect
        browser.wait(EC.visibilityOf(USABubble), 5000).then(function() {
          USABubble.click();
        });
        // Remove Text
        search.clear();

        //Clicking OK
        browser.wait(EC.visibilityOf(ok), 5000).then(function() {
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

  it('Lock', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    // Selecting Country by giving country name in Find
    var find = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(find), 5000).then(function() {
      find.click();
    });

    // Giving country name in Search bar
    var search = element(by.css('#vzb-find-search'));
    browser.wait(EC.visibilityOf(search), 5000).then(function() {
      search.sendKeys('United States');
    });

    // Clicking Check box
    var checkBox = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(188) > label'));
    browser.wait(EC.visibilityOf(checkBox), 5000).then(function() {
      checkBox.click();
    });

    // Remove text from search bar
    search.clear();

    // Click OK
    var OK = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary'));
    browser.wait(EC.visibilityOf(OK), 5000).then(function() {
      OK.click();
    });

    //Removing hovering effect
    var USBubble = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa'));
    browser.actions().mouseMove(USBubble, {x:15, y:15}).perform();

    // Click Lock
    var lock = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(4) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(lock), 5000).then(function() {
      lock.click();
    });

    // Get co-ordinates of Slider ball
    var circle = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-timeslider > div > div.vzb-ts-slider-wrapper > svg > g > g.vzb-ts-slider-slide > circle'));
    circle.getLocation();

    // Getting USA size before play
    var USA = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa'));
    USA.getCssValue('r').then(function(radius) {
      var rad = radius;
      console.log(rad);

      // Click for Play
      play.click();
      browser.sleep(5000);

      //Clicking pause
      var pause = element(by.css('button.vzb-ts-btn-pause.vzb-ts-btn'));
      pause.click();

      // Getting USA size after play
      USA.getCssValue('r').then(function(finlRadiusParameter) {
        var finalRadius = finlRadiusParameter;
        console.log(finalRadius);

        // Comapring sizes
        expect(rad).not.toEqual(finalRadius);
      });
    });
  });

  //********************************************************************************************

  /*I can drag any panel on large screen resolutions if I drag the hand icon*/



  it('DragPanel', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    // Selecting size icon
    var sizeIcon = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(5) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(sizeIcon), 5000).then(function() {
      sizeIcon.click();
      browser.sleep(1000);
    });

    //Getting location of the panel before dargging
    var hand = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > span.thumb-tack-class.thumb-tack-class-ico-drag.fa > svg'));
    hand.getLocation().then(function (beforeDrag) {
      var bforDrag = beforeDrag;
      console.log(bforDrag);

      // Dragging the panel
      browser.actions().dragAndDrop(hand, {x:-150, y:100}).click().perform();

      //Getting location of the panel after dargging
      hand.getLocation().then(function (afterDrag) {
        var aftrDrag = afterDrag;
        console.log(aftrDrag);

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

  it('ChangeColor', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    // Getting USA rgb value before changes
    var USA = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa'));
    browser.wait(EC.visibilityOf(play), 5000);
    USA.getCssValue('fill').then(function (bforchang) {
      var beforeChange = bforchang;
      console.log(beforeChange);

      // Clicking color icon
      var colorIcon = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(1) > span.vzb-buttonlist-btn-icon.fa'));
      browser.wait(EC.visibilityOf(colorIcon), 5000).then(function() {
        colorIcon.click();
      });

      // Clicking dropDown
      var dropDown = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-title > span.vzb-caxis-selector'));
      browser.wait(EC.visibilityOf(dropDown), 5000).then(function() {
        dropDown.click();
      });

      // Clicking search bar
      var search = element(by.css('#vzb-treemenu-search'));
      browser.wait(EC.visibilityOf(search), 5000).then(function() {
        search.click();
      });
      // Giving GDP in search bar
      search.sendKeys('GDP per capita');

      // Clicking GDP button
      var gdpButton = element(by.css(
        '#vizabi-placeholder > div > div.vzb-tool-treemenu > div.vzb-treemenu-wrap.vzb-dialog-scrollable.vzb-align-y-top.vzb-align-x-left > ul > li:nth-child(1)'));
      browser.wait(EC.visibilityOf(gdpButton), 5000).then(function() {
        gdpButton.click();
      });

      // Getting USA rgb value after changes
      USA.getCssValue('fill').then(function (afterChangParameter) {
        var afterChange = afterChangParameter;
        console.log(afterChange);

        // Clicking dropDown
        dropDown.click();

        // Clicking search bar 2nd time
        search.click();

        // Remove text from search bar
        search.clear();

        // Giving Child moortality in search bar
        search.sendKeys('Child mortality rate');

        // Clicking Child mortality button
        var mortalityButton = element(by.css(
          '#vizabi-placeholder > div > div.vzb-tool-treemenu > div.vzb-treemenu-wrap.vzb-dialog-scrollable.vzb-align-y-top.vzb-align-x-left > ul > li:nth-child(1)'));
        browser.wait(EC.visibilityOf(mortalityButton), 5000).then(function() {
          mortalityButton.click();
        });

        // Clicking dropDown bar 3rd time
        dropDown.click();

        // Clicking search bar 3rd time
        search.click();

        // Remove text from search bar
        search.clear();

        // Giving Region in search bar
        search.sendKeys('Region');

        // Clicking Child mortality button
        var regionButton = element(by.css(
          '#vizabi-placeholder > div > div.vzb-tool-treemenu > div.vzb-treemenu-wrap.vzb-dialog-scrollable.vzb-align-y-top.vzb-align-x-left > ul > li'));
        browser.wait(EC.visibilityOf(regionButton), 5000).then(function() {
          regionButton.click();
        });

        //Comparing color values
        expect(beforeChange).not.toEqual(afterChange);
      });
    });
  });

  //********************************************************************************************

  /* Clicking the bubble of the United States should select it. The bubble
   * gets full opacity, while the other bubbles get lower opacity.
   */

  it('opacity', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    // Clicking the bubble of USA
    var USABubble = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa'));
    browser.wait(EC.visibilityOf(USABubble), 5000).then(function() {
      browser.actions().dragAndDrop(USABubble, {x:0, y:-15}).click().perform();
    });

    // Getting USA opacity value
    var USA = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > g.vzb-bc-entity.trail-usa > g:nth-child(216)'));
    USA.getCssValue('opacity').then(function(USAOpacityAsParameter) {
      var USAOpacity = USAOpacityAsParameter;
      console.log(USAOpacity);

      // Getting Nigeria Opacity value
      var nga = element(by.css(
        '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-nga'));
      nga.getCssValue('opacity').then(function(NGAOpacityAsParameter) {
        var NGAOpacity = NGAOpacityAsParameter;
        console.log(NGAOpacity);

        //Comparing opacities
        expect(USAOpacity).not.toEqual(NGAOpacity);

      });
    });
  });

  //********************************************************************************************

  /* The year appears on the background, un-cropped */

  it('backgroundyear', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');


    // Getting year's 1st digit
    var firstDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(1)'));
    browser.wait(EC.visibilityOf(firstDigit), 5000);
    firstDigit.getText().then(function (firstDigitAsParameter) {
      var firstDigitText = firstDigitAsParameter;
      console.log(firstDigitText);

      // Comparing the year's 1st digit
      var firstDigitOfYear = '2';
      expect(firstDigitText).toBe(firstDigitOfYear);

      // Getting year's 2nd digit
      var secondDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(2)'));
      browser.wait(EC.visibilityOf(secondDigit), 5000);
      secondDigit.getText().then(function (secondDigitAsParameter) {
        var secondDigitText = secondDigitAsParameter;
        console.log(secondDigitText);

        // Comparing the year's 2nd digit
        var secondDigitOfYear = '0';
        expect(secondDigitText).toBe(secondDigitOfYear);

        // Getting year's 3rd digit
        var thirdDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(3)'));
        browser.wait(EC.visibilityOf(thirdDigit), 5000);
        thirdDigit.getText().then(function (thirdDigitAsParameter) {
          var thirdDigitText = thirdDigitAsParameter;
          console.log(thirdDigitText);

          // Comparing the year's 3rd digit
          var thirdDigitOfYear = '1';
          expect(thirdDigitText).toBe(thirdDigitOfYear);

          // Getting year's 4th digit
          var fourthDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-bc-year > text:nth-child(4)'));
          browser.wait(EC.visibilityOf(fourthDigit), 5000);
          fourthDigit.getText().then(function (fourthDigitAsParameter) {
            var fourthDigitText = fourthDigitAsParameter;
            console.log(fourthDigitText);

            // Comparing the year's 4th digit
            var fourthDigitOfYear = '5';
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

  it('deselectByCross', function() {

    browser.get('/tools/bubbles');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    // Hovering the US bubble
    var USABubble = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-bubbles > circle.vzb-bc-entity.bubble-usa'));
    browser.actions().dragAndDrop(USABubble, {x:0, y:-15}).click().perform();

    // Unselect country by clicking bubble
    browser.actions().dragAndDrop(USABubble, {x:0, y:-15}).click().perform();

    // Select the US bubble again
    browser.actions().dragAndDrop(USABubble, {x:0, y:-15}).click().perform();

    // Unselect country by click
    var cross = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > svg.vzb-bc-bubbles-crop > g.vzb-bc-labels > g > g'));
    browser.wait(EC.visibilityOf(play), 5000);
    browser.actions().dragAndDrop(cross, {x:0, y:0}).click().perform();

    // Getting USA opacity value
    USABubble.getCssValue('opacity').then(function(USAOpacityAsParameter) {
      var USAOpacity = USAOpacityAsParameter;
      console.log(USAOpacity);

      //Value for comparing with opacity
      var findMe = 1 ;

      //Comparing opacities
      expect(USAOpacity).not.toEqual(findMe);
    });
  });

  //**************************MOUNTAIN CHART*************************************

  /*
   * Click "find" and check a few countries there, they should get selected on
   * the visualization and their names should appear as a list on top left.
   * Population should be displayed after the name.
   */

  it('mountainFind', function() {

    browser.get('/tools/mountain');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    //Clicking find
    var find = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(find), 5000).then(function() {
      find.click();
    });
    // Place Text in Search
    var search = browser.element(by.css('#vzb-find-search'));
    browser.wait(EC.visibilityOf(search), 5000).then(function() {
      search.sendKeys('china');
    });
    //Clicking China
    var china = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(30) > label'));
    browser.wait(EC.visibilityOf(china), 5000).then(function() {
      china.click();
    });

    // Getting name from check box
    var chinaCheckBox = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(30)'));
    browser.wait(EC.visibilityOf(chinaCheckBox), 5000);

    //Getting text from China check box
    chinaCheckBox.getText().then(function (chinaCheckBoxTextAsParameter) {
      var chinaCheckBoxText = chinaCheckBoxTextAsParameter;
      console.log(chinaCheckBoxText);

      // Clicking OK of Find pop up
      var ok = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary > span'));
      browser.wait(EC.visibilityOf(chinaCheckBox), 5000).then(function() {
        ok.click();
      });

      // Getting atrributes of population
      var chinaBall = element(by.css('#chn-label > text:nth-child(3)'));
      browser.wait(EC.visibilityOf(chinaBall), 5000);

      //Getting text from china ball
      chinaBall.getText().then(function (chinaBallAsParameter) {
        var chinaBallText = chinaBallAsParameter;
        console.log(chinaBallText);

        //Getting country name from population
        var subStr = chinaBallText.substring(0, 5);
        console.log(subStr);

        //Getting population
        var population = chinaBallText.substring(7, 11);
        console.log(population);

        //Comparing population
        var givenPop = '1.4B';
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
    browser.get('/tools/mountain');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    // Clicking show icon
    var show = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(4) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(show), 5000).then(function() {
      show.click();
    });

    // Giving the country name to search bar
    var search = browser.element(by.css('#vzb-show-search'));
    browser.wait(EC.visibilityOf(search), 5000).then(function() {
      search.sendKeys('china');
    });

    // Clicking the check box of china
    var checkBox = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(36) > label'));
    browser.wait(EC.visibilityOf(checkBox), 5000, 'Check box is not clicked').then(function() {
      checkBox.click();
    });

    //Removing text from search bar
    browser.wait(EC.visibilityOf(search), 5000).then(function() {
      search.clear();
    });

    // Giving second name to search bar
    browser.wait(EC.visibilityOf(search), 5000).then(function() {
      search.sendKeys('united states');
    });

    // Clicking the check box of USA
    var checkUSA = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(182) > label'));
    browser.wait(EC.visibilityOf(checkUSA), 5000).then(function() {
      checkUSA.click();
    });

    //Clicking OK of show pop up
    var ok = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary > span'));
    browser.wait(EC.visibilityOf(ok), 5000).then(function() {
      ok.click();
    });

    //Clicking find
    var find = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(find), 5000).then(function() {
      find.click();
    });

    // Check China Text Box
    var checkChn = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(1) > label'));
    browser.wait(EC.visibilityOf(checkChn), 5000).then(function() {
      checkChn.click();
    });

    //Getting China Text from check box field
    var chinaCheckBox = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(1)'));
    browser.wait(EC.visibilityOf(chinaCheckBox), 5000);
    chinaCheckBox.getText().then(function (chinaCheckBoxTextAsParameter) {
      var chinaCheckBoxText = chinaCheckBoxTextAsParameter;
      console.log(chinaCheckBoxText);


      //Getting China Text from population
      var chinaBall = element(by.css('#chn-label > text:nth-child(3)'));
      browser.wait(EC.visibilityOf(chinaBall), 5000);
      chinaBall.getText().then(function (chinaBallAsParameter) {
        var chinaBallText = chinaBallAsParameter;
        console.log(chinaBallText);

        //Getting country name from population
        var subStrChn = chinaBallText.substring(0, 5);
        console.log(subStrChn);

        // Check USA Text Box
        var checkUSA1 = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(2) > label'));
        browser.wait(EC.visibilityOf(checkUSA1), 5000).then(function() {
          checkUSA1.click();
        });

        //Getting USA Text from check box field
        var USACheckBoxText = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(2)'));
        browser.wait(EC.visibilityOf(USACheckBoxText), 5000);
        USACheckBoxText.getText().then(function (USACheckBoxTextAsParameter) {
          var USACheckBoxText = USACheckBoxTextAsParameter;
          console.log(USACheckBoxText);

          //Getting USA Text from population
          var usaBall = browser.element(by.css('#usa-label > text:nth-child(3)'));
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
    browser.get('/tools/mountain');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');


    // Getting year's 1st digit
    var firstDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(1)'));
    browser.wait(EC.visibilityOf(firstDigit), 5000);
    firstDigit.getText().then(function (firstDigitAsParameter) {
      var firstDigitText = firstDigitAsParameter;
      console.log(firstDigitText);

      // Comparing the year's 1st digit
      var firstDigitOfYear = '2';
      expect(firstDigitText).toBe(firstDigitOfYear);

      // Getting year's 2nd digit
      var secondDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(2)'));
      browser.wait(EC.visibilityOf(secondDigit), 5000);
      secondDigit.getText().then(function (secondDigitAsParameter) {
        var secondDigitText = secondDigitAsParameter;
        console.log(secondDigitText);

        // Comparing the year's 2nd digit
        var secondDigitOfYear = '0';
        expect(secondDigitText).toBe(secondDigitOfYear);

        // Getting year's 3rd digit
        var thirdDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(3)'));
        browser.wait(EC.visibilityOf(thirdDigit), 5000);
        thirdDigit.getText().then(function (thirdDigitAsParameter) {
          var thirdDigitText = thirdDigitAsParameter;
          console.log(thirdDigitText);

          // Comparing the year's 3rd digit
          var thirdDigitOfYear = '1';
          expect(thirdDigitText).toBe(thirdDigitOfYear);

          // Getting year's 4th digit
          var fourthDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(4)'));
          browser.wait(EC.visibilityOf(fourthDigit), 5000);
          fourthDigit.getText().then(function (fourthDigitAsParameter) {
            var fourthDigitText = fourthDigitAsParameter;
            console.log(fourthDigitText);

            // Comparing the year's 4th digit
            var fourthDigitOfYear = '5';
            expect(fourthDigitText).toBe(fourthDigitOfYear);

            // Clicking Options icon
            var options = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(5) > span.vzb-buttonlist-btn-icon.fa'));
            browser.wait(EC.visibilityOf(options), 6000).then(function() {
              options.click();
            });

            // Clicking X and Y
            var XandY = browser.element(by.xpath('//*[@id="vizabi-placeholder"]/div/div[2]/div[1]/div[5]/div/div[2]/div[2]/div[4]/div/div[1]/span'));
            browser.wait(EC.visibilityOf(XandY), 6000).then(function() {
              XandY.click();
            });

            // Clicking probeline search bar
            var searchBar = browser.element(by.xpath('//*[@id="vizabi-placeholder"]/div/div[2]/div[1]/div[5]/div/div[2]/div[2]/div[4]/div/div[2]/div[4]/input'));
            browser.wait(EC.visibilityOf(searchBar), 6000).then(function() {
              searchBar.click();
            });
            // Getting text from probeline search bar
            searchBar.getAttribute('value').then(function (searchBarAsParameter) {
              var searchBarText = searchBarAsParameter;
              console.log(searchBarText);

              // Comparing value of probline search bar
              peakVal = '1.93';
              downVal = '1.64';
              expect(peakVal).toBeGreaterThan(searchBarText);
              expect(downVal).toBeLessThan(searchBarText);

              // Clicking Option pop up OK
              var optionsPopUpOk = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div'));
              browser.wait(EC.visibilityOf(optionsPopUpOk), 5000).then(function() {
                optionsPopUpOk.click();
              });

              // Clicking Stack
              var stack = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(3) > span.vzb-buttonlist-btn-icon.fa > svg'));
              browser.wait(EC.visibilityOf(stack), 5000).then(function() {
                stack.click();
              });
              // Clicking the world radio button
              var world = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-active.notransition.vzb-popup > div > div.vzb-dialog-content.vzb-dialog-scrollable > form.vzb-howtomerge.vzb-dialog-paragraph > label:nth-child(4) > input[type=radio]'));
              browser.wait(EC.visibilityOf(world), 5000).then(function() {
                world.click();
              });
              // Clicking stack pop up OK
              var stackPopUpOk = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div'));
              browser.wait(EC.visibilityOf(stackPopUpOk), 5000).then(function() {
                stackPopUpOk.click();
              });
              //Clicking the curve of mountain
              var mountain = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-mountains'));
              browser.wait(EC.visibilityOf(mountain), 5000).then(function() {
                mountain.click();
              });
              // Getting atrributes of population
              var worldBall = element(by.css('#all-label > text:nth-child(3)'));
              browser.wait(EC.visibilityOf(worldBall), 5000);
              worldBall.getText().then(function (worldBallAsParameter) {
                var worldBallText = worldBallAsParameter;
                console.log(worldBallText);

                // Comparing the Check box country with selected country on the chart
                var subStr = worldBallText.substring(7, 11);
                console.log(subStr);
                var pop = '7.3B';
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
    browser.get('/tools/mountain');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    //Clicking Show icon
    var showIcon = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(4) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(showIcon), 5000).then(function() {
      showIcon.click();
    });
    //Clicking check box of Afghanistan
    var afg = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(1) > label'));
    browser.wait(EC.visibilityOf(afg), 5000).then(function() {
      afg.click();
    });
    //Clicking check box of Algeria
    var alg = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(3) > label'));
    browser.wait(EC.visibilityOf(alg), 5000).then(function() {
      alg.click();
    });

    //Clicking OK of show pop up
    var ok = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary'));
    browser.wait(EC.visibilityOf(ok), 5000).then(function() {
      ok.click();
    });

    //Clicking Show icon to uncheck the country
    browser.wait(EC.visibilityOf(showIcon), 5000).then(function() {
      showIcon.click();
    });
    //Unchecking Afghanistan
    browser.wait(EC.visibilityOf(afg), 5000).then(function() {
      afg.click();
      browser.sleep(2000);
    });

    //Unchecking Algeria
    browser.wait(EC.visibilityOf(alg), 5000).then(function() {
      alg.click();
      browser.sleep(2000);
    });

    //Clicking OK of show pop up
    browser.wait(EC.visibilityOf(ok), 5000).then(function() {
      ok.click();
    });

    //Clicking find
    var find = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(find), 5000).then(function() {
      find.click();
    });

    //Clicking Search bar of find
    var search = browser.element(by.css('#vzb-find-search'));
    browser.wait(EC.visibilityOf(search), 5000);

    //Entering China to searchbar
    browser.wait(EC.visibilityOf(search), 5000).then(function() {
      search.sendKeys('china');
    });

    // Check China Text Box
    var checkChn = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(30) > label'));
    browser.wait(EC.visibilityOf(checkChn), 5000).then(function() {
      checkChn.click();
    });

    //Getting China Terxt from check box field
    var chinaCheckBox = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(30)'));
    browser.wait(EC.visibilityOf(chinaCheckBox), 5000);
    chinaCheckBox.getText().then(function (chinaCheckBoxTextAsParameter) {
      var chinaCheckBoxText = chinaCheckBoxTextAsParameter;
      console.log(chinaCheckBoxText);

      //Getting China Terxt from population
      var chinaBall = element(by.css('#chn-label > text:nth-child(3)'));
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
        search.sendKeys('united states');

        //Clicking check box of USA
        var checkUSA = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(156) > label'));
        browser.wait(EC.visibilityOf(checkUSA), 5000).then(function() {
          checkUSA.click();
        });
        //Getting USA Text from check box field
        var USACheckBoxText = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(156)'));
        browser.wait(EC.visibilityOf(USACheckBoxText), 5000);
        USACheckBoxText.getText().then(function (USACheckBoxTextAsParameter) {
          var USACheckBoxText = USACheckBoxTextAsParameter;
          console.log(USACheckBoxText);

          //Getting USA Text from population
          var usaBall = browser.element(by.css('#usa-label > text:nth-child(3)'));
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
    browser.get('/tools/mountain');
    browser.wait(EC.visibilityOf(play), 60000, 'Chart is not Loaded');

    // Getting year's 1st digit  at 2015
    var firstDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(1)'));
    browser.wait(EC.visibilityOf(firstDigit), 5000);
    firstDigit.getText().then(function (firstDigitAsParameter) {
      var firstDigitText = firstDigitAsParameter;
      console.log(firstDigitText);

      // Comparing the year's 1st digit
      var firstDigitOfYear = '2';
      expect(firstDigitText).toBe(firstDigitOfYear);

      // Getting year's 2nd digit at 2015
      var secondDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(2)'));
      browser.wait(EC.visibilityOf(secondDigit), 5000);
      secondDigit.getText().then(function (secondDigitAsParameter) {
        var secondDigitText = secondDigitAsParameter;
        console.log(secondDigitText);

        // Comparing the year's 2nd digit
        var secondDigitOfYear = '0';
        expect(secondDigitText).toBe(secondDigitOfYear);

        // Getting year's 3rd digit at 2015
        var thirdDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(3)'));
        browser.wait(EC.visibilityOf(thirdDigit), 5000);
        thirdDigit.getText().then(function (thirdDigitAsParameter) {
          var thirdDigitText = thirdDigitAsParameter;
          console.log(thirdDigitText);

          // Comparing the year's 3rd digit
          var thirdDigitOfYear = '1';
          expect(thirdDigitText).toBe(thirdDigitOfYear);


          // Getting year's 4th digit at 2015
          var fourthDigit = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-year > text:nth-child(4)'));
          browser.wait(EC.visibilityOf(fourthDigit), 5000);
          fourthDigit.getText().then(function (fourthDigitAsParameter) {
            var fourthDigitText = fourthDigitAsParameter;
            console.log(fourthDigitText);

            // Comparing the year's 4th digit
            var fourthDigitOfYear = '5';
            expect(fourthDigitText).toBe(fourthDigitOfYear);

            // Hovering the poverty line at default place at 2015
            var axis = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > rect'));
            browser.wait(EC.visibilityOf(axis), 5000);
            browser.actions().mouseMove(axis, {x:371, y:1}).perform();

            // Getting attributes of poverty line at 2015
            var line = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg > g > g.vzb-mc-probe'));
            browser.wait(EC.visibilityOf(line), 5000);
            line.getText().then(function (lineAsParameter) {
              var lineText = lineAsParameter;
              console.log(lineText);

              //Getting population at 2015
              var subStr = lineText.substring(12, 16);
              console.log(subStr);

              // Comparing the population at 2015
              var peakVal = '828';
              var downVal = '826';
              expect(peakVal).toBeGreaterThan(subStr);
              expect(downVal).toBeLessThan(subStr);

              // Drag the Slider ball to 1800
              var circle = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-timeslider > div > div.vzb-ts-slider-wrapper > svg.vzb-ts-slider > g > g.vzb-ts-slider-slide > circle'));
              browser.wait(EC.visibilityOf(circle), 5000);
              browser.actions().dragAndDrop(circle, {x:-1200, y:0}).perform();

              // Getting year's 1st digit  at 1800
              firstDigit.getText().then(function (firstDigitAsParameter) {
                var firstDigitText = firstDigitAsParameter;
                console.log(firstDigitText);

                // Comparing the year's 1st digit
                var firstDigitOfYear1 = '1';
                expect(firstDigitText).toBe(firstDigitOfYear1);

                // Getting year's 2nd digit at 1800
                secondDigit.getText().then(function (secondDigitAsParameter) {
                  var secondDigitText = secondDigitAsParameter;
                  console.log(secondDigitText);

                  // Comparing the year's 2nd digit
                  var secondDigitOfYear1 = '8';
                  expect(secondDigitText).toBe(secondDigitOfYear1);


                  // Getting year's 3rd digit at 1800
                  thirdDigit.getText().then(function (thirdDigitAsParameter) {
                    var thirdDigitText = thirdDigitAsParameter;
                    console.log(thirdDigitText);

                    // Comparing the year's 3rd digit
                    var thirdDigitOfYear1 = '0';
                    expect(thirdDigitText).toBe(thirdDigitOfYear1);


                    // Getting year's 4th digit at 1800
                    fourthDigit.getText().then(function (fourthDigitAsParameter) {
                      var fourthDigitText = fourthDigitAsParameter;
                      console.log(fourthDigitText);

                      // Comparing the year's 4th digit
                      var fourthDigitOfYear1 = '0';
                      expect(fourthDigitText).toBe(fourthDigitOfYear1);

                      // Hovering the poverty line at 1800
                      browser.actions().mouseMove(axis, {x:371, y:1}).perform();


                      // Getting attributes of poverty line at 1800
                      line.getText().then(function (lineAsParameter1) {
                        var lineTextAfterDrag = lineAsParameter1;
                        console.log(lineTextAfterDrag);


                        //Getting population at 1800
                        var subStrAfterDrag = lineTextAfterDrag.substring(12, 16);
                        console.log(subStrAfterDrag);

                        // Comparing the population at 1800
                        var findMe = '812M';


                        // Comparing value of probline search bar
                        peakVal = '813';
                        downVal = '811';
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


  //*****************************BUBBLE MAP*************************************


  /*
   * I can select and deselect countries using the button "Find" to the right.
   */


  it('findmap', function() {
    browser.get('/tools/map');
    browser.wait(EC.visibilityOf(USABubbleMap), 60000, 'Chart is not Loaded');

    //Clicking find
    var find = element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(2) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(find), 5000).then(function() {
      find.click();
    });
    //Placing text in search field
    var search = element(by.css('#vzb-find-search'));
    browser.wait(EC.visibilityOf(search), 5000).then(function() {
      search.sendKeys('china');
    });

    // Check China Text Box
    var chinaBubble = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(42) > label'));
    browser.wait(EC.visibilityOf(chinaBubble), 5000).then(function() {
      chinaBubble.click();
    });

    // Remove Text
    search.clear();

    // Place Text in Search / Find Field
    browser.wait(EC.visibilityOf(search), 5000).then(function() {
      search.sendKeys('united states');
    });

    // Check United States Text Box
    var USABubble = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content.vzb-dialog-content-fixed.vzb-dialog-scrollable > div > div:nth-child(217) > label'));
    browser.wait(EC.visibilityOf(USABubble), 5000).then(function() {
      USABubble.click();
    });

    // Remove Text
    search.clear();


    //clicking ok
    var ok = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons > div.vzb-dialog-button.vzb-label-primary > span'));
    browser.wait(EC.visibilityOf(ok), 5000).then(function() {
      ok.click();
    });

    // Getting USA opacity value
    var USA = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)'));
    browser.wait(EC.visibilityOf(USA), 5000);
    USA.getCssValue('opacity').then(function(USAOpacityAsParameter) {
      var USAOpacity = USAOpacityAsParameter;
      console.log(USAOpacity);

      // Getting Nigeria Opacity value
      var nga = element(by.css(
        '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(7)'));
      browser.wait(EC.visibilityOf(nga), 5000);
      nga.getCssValue('opacity').then(function(NGAOpacityAsParameter) {
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

  it('hoverMap', function() {

    browser.get('/tools/map');
    browser.wait(EC.visibilityOf(USABubbleMap), 60000, 'Chart is not Loaded');

    // Hovering the China Bubble
    var china = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(1)'));
    browser.wait(EC.visibilityOf(china), 5000);
    browser.actions().mouseMove(china).perform();
    var findMe = 'China';

    // Getting attributes of Tooltip
    var tooltip = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-tooltip'));
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

  it('opacityMap', function() {
    browser.get('/tools/map');
    browser.wait(EC.visibilityOf(USABubbleMap), 60000, 'Chart is not Loaded');

    // Clicking the bubble of USA
    var USABubble = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)'));
    browser.wait(EC.visibilityOf(USABubble), 5000).then(function() {
      USABubble.click();
    });

    // Getting USA opacity value
    var USA = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)'));
    browser.wait(EC.visibilityOf(USA), 5000);
    USA.getCssValue('opacity').then(function(USAOpacityAsParameter) {
      var USAOpacity = USAOpacityAsParameter;
      console.log(USAOpacity);

      // Getting Nigeria Opacity value
      var nga = element(by.css(
        '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(7)'));
      browser.wait(EC.visibilityOf(nga), 5000);
      nga.getCssValue('opacity').then(function(NGAOpacityAsParameter) {
        var NGAOpacity = NGAOpacityAsParameter;
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

  it('DragLabelMap', function() {
    browser.get('/tools/map');
    browser.wait(EC.visibilityOf(USABubbleMap), 60000, 'Chart is not Loaded');

    //Clicking USA bubble
    var USABubble = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)'));
    browser.wait(EC.visibilityOf(USABubble), 5000).then(function() {
      USABubble.click();
    });
    //Getting tooltip text before drag
    var USALabel = element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-labels > g > rect'));
    browser.wait(EC.visibilityOf(USALabel), 5000);
    USALabel.getLocation().then(function(initiallocation) {
      var initialLocationText = initiallocation.x;
      console.log(initialLocationText);

      //Dragging tooltip
      browser.actions().dragAndDrop(USALabel, {x: -100, y: 150}).click().perform();
      browser.sleep(2000);

      //Getting tooltip text after drag
      USALabel.getLocation().then(function(finalLocationText) {
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

  it('crossLabelMap', function() {
    browser.get('/tools/map');
    browser.wait(EC.visibilityOf(USABubbleMap), 60000, 'Chart is not Loaded');

    // Clicking the US bubble
    var USABubble = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)'));
    browser.wait(EC.visibilityOf(USABubble), 5000).then(function() {
      USABubble.click();
    });

    //Unselectiong the US bubble by clikcing bubble
    browser.wait(EC.visibilityOf(USABubble), 5000).then(function() {
      USABubble.click();
    });

    // Clicking the US bubble again
    browser.wait(EC.visibilityOf(USABubble), 5000).then(function() {
      USABubble.click();
    });

    //Hovering the label to get cross
    var tooltip = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-labels > g > rect'));
    browser.wait(EC.visibilityOf(tooltip), 5000);
    browser.actions().mouseMove(tooltip).perform();

    // Unselect country by click
    var cross = element(by.css(
      '#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-labels > g > g'));
    browser.wait(EC.visibilityOf(cross), 5000);
    browser.actions().mouseMove(cross).click().perform();

  });

  //********************************************************************************************

  /*
   * bubbles react on hover
   */

  it('BubbleMapHover', function() {
    browser.get('/tools/map');
    browser.wait(EC.visibilityOf(USABubbleMap), 60000, 'Chart is not Loaded');

    // Hovering the China Bubble
    var china = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(1)'));
    browser.wait(EC.visibilityOf(china), 5000);
    browser.actions().mouseMove(china).perform();

    // Getting attributes of Tooltip
    var tooltip = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-tooltip'));
    browser.wait(EC.visibilityOf(tooltip), 5000);
    tooltip.getText().then(function (tooltipAsParameter) {
      var tooltipText = tooltipAsParameter;
      console.log(tooltipText);

      // Comparing the country name
      var findMe = 'China';
      expect(tooltipText).toBe(findMe);

    });
  });

  //********************************************************************************************

  /*
   * The bubbles change size with timeslider drag and play
   */

  it('BubbleMapdrag', function() {
    browser.get('/tools/map');
    browser.wait(EC.visibilityOf(USABubbleMap), 60000, 'Chart is not Loaded');

    //USA bubble element
    var USA = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)'));
    browser.wait(EC.visibilityOf(USA), 5000);

    //Bubble size before play
    USA.getCssValue('r').then(function (USAAsParameter) {
      var heightBefore = USAAsParameter;
      console.log('Bubble Size before play ');
      console.log(heightBefore);

      //Clicking play
      browser.wait(EC.visibilityOf(play), 5000).then(function() {
        play.click();
        browser.sleep(3000);
      });

      //Clicking pause
      var pause = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-timeslider > div > div.vzb-ts-btns > button.vzb-ts-btn-pause.vzb-ts-btn > svg'));
      browser.wait(EC.visibilityOf(pause), 5000).then(function() {
        pause.click();
      });

      //Bubble size after play ang before drag
      USA.getCssValue('r').then(function (USAAsParameter1) {
        var heightAfter = USAAsParameter1;
        console.log('Bubble size after play ang before drag');
        console.log(heightAfter);

        //Comparing sizes
        expect(heightBefore).not.toEqual(heightAfter);

        //Getting the location of slider ball before darg
        slider.getLocation().then(function (sliderAsParameter) {
          var positionBefore = sliderAsParameter.x;
          console.log('Slider Location before Drag');
          console.log(positionBefore);

          //Dragging the slider ball
          browser.actions().dragAndDrop(slider, {x:500, y:0}).perform();

          //Bubble size after drag
          USA.getCssValue('r').then(function (USAAsParameter11) {
            var heightAfterDrag = USAAsParameter11;
            console.log('Bubble size after Drag');
            console.log(heightAfter);

            //Comparing sizes
            expect(heightAfterDrag).not.toEqual(heightAfter);

            //Getting the location of slider ball after drag
            slider.getLocation().then(function (sliderAsParameter1) {
              var positionAfter = sliderAsParameter1.x;
              console.log('Slider Location after Drag');
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
    browser.get('/tools/map');
    browser.wait(EC.visibilityOf(USABubbleMap), 60000, 'Chart is not Loaded');

    //USA bubble element
    var USA = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)'));
    browser.wait(EC.visibilityOf(USA), 5000);

    // Clicking size icon
    var size = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-buttonlist > button:nth-child(3) > span.vzb-buttonlist-btn-icon.fa'));
    browser.wait(EC.visibilityOf(size), 5000).then(function() {
      size.click();
    });

    //Bubble size before dargging
    USA.getSize().then(function (USAAsParameter) {
      var heightBefore = USAAsParameter.height;
      console.log(heightBefore);

      // dargging minimum pointer to the maximum
      var sliderOfSize = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-content > div > div > svg > g > g > g.resize.w.vzb-bs-slider-thumb > g'));
      browser.wait(EC.visibilityOf(sliderOfSize), 5000);
      browser.actions().dragAndDrop(sliderOfSize, {x:100, y:0}).perform();

      //Bubble size after dargging
      USA.getSize().then(function (USAAsParameter1) {
        var heightAfter = USAAsParameter1.height;
        console.log(heightAfter);

        //clicking OK
        var ok = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-sidebar > div.vzb-tool-dialogs > div.vzb-top-dialog.vzb-dialogs-dialog.vzb-dialog-shadow.vzb-popup.vzb-active.notransition > div > div.vzb-dialog-buttons'));
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
    browser.get('/tools/map');
    browser.wait(EC.visibilityOf(USABubbleMap), 60000, 'Chart is not Loaded');

    //Hovering USA bubble element
    var USA = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-bubbles > circle:nth-child(3)'));
    browser.wait(EC.visibilityOf(USA), 5000);
    browser.actions().mouseMove(USA).perform();

    // Getting attributes of population
    var population = browser.element(by.css('#vizabi-placeholder > div > div.vzb-tool-stage > div.vzb-tool-viz > div > svg.vzb-bubblemap-svg > g > g.vzb-bmc-axis-y-title'));
    browser.wait(EC.visibilityOf(population), 5000);
    population.getText().then(function (populationAsParameter) {
      var populationText = populationAsParameter;
      console.log(populationText);

      // Comparing the population
      var findMe = '322M';
      var populationInMillion = populationText.substring(6, 10);
      console.log(populationInMillion);
      expect(findMe).toBe(populationInMillion);
    });
  });



});

