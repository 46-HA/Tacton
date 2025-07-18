$(document).ready(function () {
  $(".begin").on("click", function () {
    $(".sec-A").addClass("showing");
    $(".head").hide();
    $(".content-wrap").hide();
    
    // Force scroll to top when showing second page
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 100);
  });
  
  $(".down").on("click", function () {
    $(".head").addClass("head-hide");
  });
  
  $(".home").on("click", function () {
    $(".side").removeClass("showing");
  });
  
  $(".code-btn").on("click", function () {
    $(".sec-B").addClass("showing");
  });
  
  $(".back-btn").on("click", function () {
    $(".sec-B").removeClass("showing");
  });
});

// variables
const circle = document.querySelector(".circle");
const two = document.querySelector(".two");
const three = document.querySelector(".three");

// funcs

function homepage() {
  document.getElementById("homepage").scrollIntoView();
  document.getElementById("sec-A").classList.remove("showing");
  document.getElementById("header").style.display = "block";
  document.getElementById("content-wrap").style.display = "block";

  const scrollPercentage =
    (window.scrollY * 500) /
    (document.documentElement.scrollHeight - window.innerHeight);

  circle.style.left = `${scrollPercentage}%`;
  two.style.transform = `translateX(${scrollPercentage * 0.3}%)`;
  three.style.transform = `translateY(${scrollPercentage * 1}%)`;
}

document.addEventListener("scroll", (e) => {
  const scrollPercentage =
    (window.scrollY * 500) /
    (document.documentElement.scrollHeight - window.innerHeight);

  circle.style.left = `${scrollPercentage}%`;
  two.style.transform = `translateX(${scrollPercentage}px)`;
  three.style.transform = `translateY(${scrollPercentage * 1}%)`;
});

// cards
function Util() {}

/*
	class manipulation functions
*/
Util.hasClass = function (el, className) {
  if (el.classList) return el.classList.contains(className);
  else
    return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
};
Util.addClass = function (el, className) {
  var classList = className.split(" ");
  if (el.classList) el.classList.add(classList[0]);
  else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(" "));
};
Util.removeClass = function (el, className) {
  var classList = className.split(" ");
  if (el.classList) el.classList.remove(classList[0]);
  else if (Util.hasClass(el, classList[0])) {
    var reg = new RegExp("(\\s|^)" + classList[0] + "(\\s|$)");
    el.className = el.className.replace(reg, " ");
  }
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(" "));
};
Util.toggleClass = function (el, className, bool) {
  if (bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};
Util.setAttributes = function (el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/*
	Smooth Scroll
*/
Util.scrollTo = function (final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;
  if (!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
  var animateScroll = function (timestamp) {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if (progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final - start, duration);
    element.scrollTo(0, val);
    if (progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };
  window.requestAnimationFrame(animateScroll);
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function () {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        // If deep merge and property is an object, merge properties
        if (
          deep &&
          Object.prototype.toString.call(obj[prop]) === "[object Object]"
        ) {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for (; i < length; i++) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function () {
  if (!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
};

/*
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

//Custom Event() constructor
if (typeof window.CustomEvent !== "function") {
  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined,
    };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}

/*
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

/* JS Utility Classes */
(function () {
  // make focus ring visible only for keyboard navigation (i.e., tab key)
  var focusTab = document.getElementsByClassName("js-tab-focus");
  function detectClick() {
    if (focusTab.length > 0) {
      resetFocusTabs(false);
      window.addEventListener("keydown", detectTab);
    }
    window.removeEventListener("mousedown", detectClick);
  }
  function detectTab(event) {
    if (event.keyCode !== 9) return;
    resetFocusTabs(true);
    window.removeEventListener("keydown", detectTab);
    window.addEventListener("mousedown", detectClick);
  }
  function resetFocusTabs(bool) {
    var outlineStyle = bool ? "" : "none";
    for (var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty("outline", outlineStyle);
    }
  }
  window.addEventListener("mousedown", detectClick);
})();

var cursor = document.querySelector(".cursor");
var cursor2 = document.querySelector(".cursor2");
document.addEventListener("mousemove", function (e) {
  cursor.style.cssText = cursor2.style.cssText =
    "left: " + e.clientX + "px; top: " + e.clientY + "px;";
});

function aboutme() {
  document.getElementById("aboutme").scrollIntoView();
  // Also scroll to top when aboutme is called
  setTimeout(function() {
    window.scrollTo(0, 0);
  }, 100);
}

// // Disable right-click
document.addEventListener("contextmenu", function (event) {
  event.preventDefault();

  // Display message
  alert("Can't !!!");
});