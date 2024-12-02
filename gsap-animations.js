// gsap-animations.js
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function () {
	const elements = document.querySelectorAll(".gsap-animate-element");
	elements.forEach(function (el) {
		const animationDuration = parseFloat(el.dataset.animationDuration) / 1000; // Convert to seconds
		const animationDelay = parseFloat(el.dataset.animationDelay) / 1000; // Convert to seconds
		const animationEasing = el.dataset.animationEasing || "ease";
		const animationOnce = el.dataset.animationOnce === "true";

		const animationProperties = JSON.parse(
			el.dataset.animationProperties || "{}",
		);
		const fromVars = animationProperties.fromVars || {};
		const toVars = animationProperties.toVars || {};

		// Set duration and easing
		toVars.duration = animationDuration;
		toVars.ease = animationEasing;

		// Handle delay
		if (animationDelay) {
			toVars.delay = animationDelay;
		}

		// If using ScrollTrigger
		if (animationOnce) {
			toVars.scrollTrigger = {
				trigger: el,
				start: "top bottom",
				once: true,
			};
		} else {
			// Looping animation
			toVars.repeat = -1;
			toVars.yoyo = true;
		}

		// Initialize animation
		gsap.fromTo(el, fromVars, toVars);
	});
});
