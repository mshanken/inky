var format = require('util').format;
var $ = require('cheerio');

/**
 * Returns output for desired custom element
 * @param {object} element - Element as a Cheerio object.
 * @returns {string} HTML converted from a custom element to table syntax.
 */
module.exports = function(element) {
  var inner = element.html();

  switch (element[0].name) {
    // <column>
    case this.components.columns:
      return this.makeColumn(element, 'columns');

    // <row>
    case this.components.row:
      var classes = ['row'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }

      return format('<table class="%s"><tbody><tr>%s</tr></tbody></table>', classes.join(' '), inner);

    // <button>
    case this.components.button:
      // If we have the href attribute we can create an anchor for the inner of the button;
      if (element.attr('href')) {
        inner = format('<a href="%s">%s</a>', element.attr('href'), inner);
      }

      // If the button is expanded, it needs a <center> tag around the content
      if (element.hasClass('expand')) {
        inner = format('<center>%s</center>', inner);
      }

      // The .button class is always there, along with any others on the <button> element
      var classes = ['button'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }

      return format('<table class="%s"><tr><td><table><tr><td>%s</td></tr></table></td></tr></table>', classes.join(' '), inner);

    // <container>
    case this.components.container:
      var classes = ['container'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }

      return format('<table class="%s"><tbody><tr><td>%s</td></tr></tbody></table>', classes.join(' '), inner);

    // <borderedtable>
    case this.components.borderedtable:
      var classes = ['borderedtable'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }

      return format('<table class="%s"><tbody><tr><td>%s</td></tr></tbody></table>', classes.join(' '), inner);

    // <inky>
    case this.components.inky:
      return '<tr><td><img src="https://raw.githubusercontent.com/arvida/emoji-cheat-sheet.com/master/public/graphics/emojis/octopus.png" /></tr></td>';

    // <block-grid>
    case this.components.blockGrid:
      var classes = ['block-grid', 'up-'+element.attr('up')];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }
      return format('<table class="%s"><tr>%s</tr></table>', classes.join(' '), inner);

    // <menu>
    case this.components.menu:
      var classes = ['menu'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
        if (classes.indexOf('vertical') !== -1) {
          element.children().attr('data-vertical', '1');
          // In vertical case to support outlook, we'll do an inner table.
          // However, we DON'T do this for small-vertical because outlook never shows the small version
          return format('<table class="%s"><tr><th>%s</th></tr></table>', classes.join(' '), element.html());
        }
      }
      return format('<table class="%s"><tr>%s</tr></table>', classes.join(' '), inner);

    // <item>
    case this.components.menuItem:
      if (element.attr('data-vertical')) {
        return format('<table class="menu-item"><tr><th><a href="%s">%s</a></th></tr></table>', element.attr('href'), inner);
      } else {
        return format('<th><a href="%s">%s</a></th>', element.attr('href'), inner);
      }

    // <center>
    case this.components.center:
      if (element.children().length > 0) {
        element.children()
          .attr('align', 'center')
          .addClass('text-center');
      }

      element.attr('data-parsed', '');

      return format('%s', $.html(element));

    // <callout>
    case this.components.callout:
      var classes = ['callout'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }

      return format('<table><tr><th class="%s">%s</th></tr></table>', classes.join(' '), inner);

    default:
      // If it's not a custom component, return it as-is
      return format('<tr><td>%s</td></tr>', $.html(element));
  }
}
