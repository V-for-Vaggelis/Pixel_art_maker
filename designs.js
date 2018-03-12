// Select color input
// Select size input
// I wrap my js in a function to make sure it will be ran after the html, at the end I'll run that function in the $ sym
"use strict";
function myCode() {
  const canvas = $('#pixel_canvas');
  // When size is submitted by the user, call makeGrid()
  $('form').submit(function makeGrid(evt) {
  /* We listen for a sumbit event in the form iistead of just a click event in the submit button. This way we can allow the user to only
  enter values fore height and width smaller than our max limit.When that happens we run the makeGrid Function*/
    evt.preventDefault();
    // The default of a submit button is to reload the page once clicked, we need to prevent that in order for our grid to not dissappear!
    canvas.children().remove();
    // This line is will erase any previous grid created by removing all of the table's children elemnts
    let height = $('#input_height').val();
    let width = $('#input_width').val();
    let table;
      // In this variable we will place all of the code we want to append in the table element as a string, taking advantage of the looping
      for (let i=0; i<height; i++) {
        table += "<tr>\n";
        for (let j=0; j<width; j++) {
          table += "<td>\n</td>\n";
        }
        table += "</tr>";
      }
    canvas.append(table);
  });
  // I'll the listener for the button that removes the grid
  $("#removeGrid").click(function() {
      $("td, tr").toggleClass("borderDelete")
  });
  // I'll create the listener for the button that clears all painting
  $('#clearField').click(function() {
    canvas.find('td').css("background-color", "");
  });
  // I will create a function which when called upon a targeted cell will paint it but if the selected color equals the previous one it will erase any painting
  function getColor() {
    let userColor = $('#colorPicker').val();
    return userColor;
  }
  const eraser = document.getElementById('EraserCheck');
  // This const represents the checkbox for the eraser. For some reason I can't reach this with the jquery symbol
  function paintErase(cell, colorFunc) {
    // That's the color currently selected by the user
    let selectedColorHex = colorFunc();
      if (eraser.checked === false) {
        cell.css('background-color', selectedColorHex);
      }
      // If the eraser is not selected paint
      else {
        cell.css('background-color', "rgba(146, 168, 170, 0.3)");
      }
      // If it is erase
  }
  // I'll create an array where I'll store up until 5 previously used colors, the purpose is to create a right click functionality that will pop up a window that shows previously used colors.
  var usedColors = [];
  // I'll create a function that when called will store a used color in the array
  function storeColor(color) {
    let num = usedColors.length;
    if (num < 5) {
      usedColors.push(color);
    }
    // If the array contains 5 colors, I'll delete the first one (older) and add the new one at the end
    else {
      usedColors.shift();
      usedColors.push(color);
    }
  }
  /*I want to give the user the ability to paint by dragging the mouse, A click is consisted of a mousedown and a mouseup event,
  while a drag of a mousedown  and a mousemove event, so I must listen seperately for mousedown, mousemove, mouseup. I'll also need
  a boolean to determine if that mousemove is combined with a mousedown in which case we are a talking about a drag */
  var drag = false;
  // I listen for a mousedown event using event delegation on td elemnts, once that happens i paint the targeted box cause the click already happened
  canvas.on('mousedown', 'td', function(evt) {
    evt.preventDefault();
    if (evt.button === 0) {
        // I paint for left click only, this will make the code only work in chrome, in firefox it will block the whole painting
      let box = $(evt.target);
      paintErase(box, getColor);
      drag = true;
      // now the boolean is true because the user has pressed the mouse button, if he moves the mouse now we have a drag
      let currentColor;
      currentColor = getColor();
      let num = usedColors.length;
      // I'll create a boolean to help me determine if the color has already been stored
      let savedColor = false;
      for (let i=0; i<num; i++) {
        if (currentColor === usedColors[i]) {
          savedColor = true;
        }
      }
      if (savedColor === false) {
        storeColor(currentColor);
      }
    }
  // This will stop the mousedown deafualt drag and drop action from taking over and creating pointer problems
  });
  canvas.on('mouseleave', function(evt) {
    drag = false;
    $('#moved').css("display", "none");
    // If the user drags outside the canvas the painting must stop and he will have to click again to paint
  });
  canvas.on('mousemove mouseup', 'td', function(evt) {
  // We now listen for mousemoves to spot drag events or for mouseups to tell if the user left the mouse button
    if (evt.type === 'mousemove' && drag === true) {
      let box = $(evt.target);
      paintErase(box, getColor);
      // if drag = true that means the mousemove is also accompanied by a mousedown, so the user is dragging over the targeted box and we have to paint it
    }
    else {
      drag = false;
      // else means a mouseup event, so the user left the mouse button and the drag is over
    }
  });
  const container = $('#usedColors');
  // I'll bind the right click to show the previous colors window
  canvas.bind("contextmenu", function(evt) {
    evt.preventDefault();
    container.children().remove();
    // Remove the colors showed on previous right clicks
    let num = usedColors.length;
    // I'll create a small div for each of the array's elements, colored with the color stored in that element
    for (let i=0; i<num; i++) {
      container.append("<div class=\"usedColor\"></div>\n");
      container.children().last().css("background-color", usedColors[i]);
    }
      // I'll specify where I want the window to show on right click, and I'll show it
    container.css
    ({
      left:  evt.pageX - (-15) ,
      top:   evt.pageY - 35
    }).show();
  });
  // I'll need to give the ability to click those boxes and once he does change the color, to do that I'll need a a way to convert rgb to hex
  // This is a standard function that converts rgb to hex
  function rgb2hex(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }
    // I'll need to pull the clicked box's color convert the rgb value into r,g,b numbers and send them into the rgb2hex function to get back a hex result
  container.on("click", "div", function(evt) {
    let clickedBox = $(evt.target);
    let oldColor = clickedBox.css('background-color');
    // I got the color in rgb
    let str = oldColor.replace("rgb(", "");
    let components = str.replace(")", "");
    // I remove the characters and parenthesis
    let rgbArray = components.split(",");
    // I split the number that are nwo seperated by commas into just array elements containing numbers in string form
    let rComp = Number(rgbArray[0]);
    let gComp = Number(rgbArray[1]);
    let bComp = Number(rgbArray[2]);
    // I convert them to actual numbers
    let oldColorHex = rgb2hex(rComp, gComp, bComp);
    // I get the hex value
    $('#colorPicker').val(oldColorHex);
    // I use it to change the selected color
    container.hide();
  });
  // This window will also have to hide if the users clicks elsewhere
  $(document).click(function() {
    container.hide();
  });
  // I'll create the listener that creates the lightsaber cursor on the canvas
  canvas.on('mousemove', function(e) {
    if (eraser.checked === false) {
      let userColor = getColor();
        $('#moved').css({
            "display": "inline",
            left:  e.pageX - -5,
            top:   e.pageY - 0,
        //       This changes the div's position to follow the cursor's
            "background-color": userColor,
            "color": userColor
        });
    }
  });
}
$(myCode());
