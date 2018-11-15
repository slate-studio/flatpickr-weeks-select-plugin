(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.weekSelect = factory());
}(this, (function () { 'use strict';

  function weeksSelectPlugin(config) {
    var weeksSelect = config.weeksSelect;
    if(!weeksSelect || weeksSelect < 1) weeksSelect = 1;

    return function (fp) {
      function onDayHover(event) {
        var day = event.target;
        if (!day.classList.contains("flatpickr-day")) return;
        var days = fp.days.childNodes;
        var dayIndex = day.$i;
        var dayIndSeven = dayIndex / 7;

        var startDayIndex = 7 * Math.floor(dayIndSeven);
        var endDayIndex = startDayIndex +  7 * weeksSelect - 1;

        if (endDayIndex >=  days.length) {
          endDayIndex = days.length - 1;
        }

        var weekStartDay = days[startDayIndex].dateObj;
        var weekEndDay = days[endDayIndex].dateObj;

        for (var i = days.length; i--;) {
          var _day = days[i];
          var date = _day.dateObj;
          if (date > weekEndDay || date < weekStartDay) _day.classList.remove("inRange");else _day.classList.add("inRange");
        }
      }

      function highlightWeek() {
        var selDate = fp.latestSelectedDateObj;

        if (selDate !== undefined && selDate.getMonth() === fp.currentMonth && selDate.getFullYear() === fp.currentYear) {
          var startDayIndex = 7 * Math.floor(fp.selectedDateElem.$i / 7);
          var endDayIndex = startDayIndex +  7 * weeksSelect - 1;

          if (endDayIndex >=  fp.days.childNodes.length) {
            endDayIndex = fp.days.childNodes.length - 1;
          }

          fp.weekStartDay = fp.days.childNodes[startDayIndex].dateObj;
          fp.weekEndDay = fp.days.childNodes[endDayIndex].dateObj;
        }

        var days = fp.days.childNodes;

        for (var i = days.length; i--;) {
          var date = days[i].dateObj;
          if (date >= fp.weekStartDay && date <= fp.weekEndDay) days[i].classList.add("week", "selected");
        }
      }

      function clearHover() {
        var days = fp.days.childNodes;

        for (var i = days.length; i--;) {
          days[i].classList.remove("inRange");
        }
      }

      function onReady() {
        if (fp.daysContainer !== undefined) fp.daysContainer.addEventListener("mouseover", onDayHover);
      }

      function onDestroy() {
        if (fp.daysContainer !== undefined) fp.daysContainer.removeEventListener("mouseover", onDayHover);
      }

      return {
        onValueUpdate: highlightWeek,
        onMonthChange: highlightWeek,
        onYearChange: highlightWeek,
        onClose: clearHover,
        onParseConfig: function onParseConfig() {
          fp.config.mode = "single";
          fp.config.enableTime = false;
          fp.config.dateFormat = fp.config.dateFormat ? fp.config.dateFormat : "\\W\\e\\e\\k #W, Y";
          fp.config.altFormat = fp.config.altFormat ? fp.config.altFormat : "\\W\\e\\e\\k #W, Y";
        },
        onReady: [onReady, highlightWeek],
        onDestroy: onDestroy
      };
    };
  }

  return weeksSelectPlugin;

})));
