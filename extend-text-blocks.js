// extend-text-blocks.js
(function (wp) {
	const { addFilter } = wp.hooks;
	const { createHigherOrderComponent } = wp.compose;
	const { Fragment, createElement } = wp.element;
	const { InspectorControls } = wp.blockEditor || wp.editor;
	const { PanelBody, SelectControl, RangeControl, ToggleControl, TextControl } =
		wp.components;

	// 1. Extend block attributes to include new style and animation attributes
	function addTextBlockAttributes(settings, name) {
		if (name !== "core/heading" && name !== "core/paragraph") {
			return settings;
		}

		// Define new attributes
		const newAttributes = {
			fontWeight: { type: "string", default: "normal" },
			lineHeight: { type: "string", default: "normal" },
			// Animation Attributes
			animationType: { type: "string", default: "" },
			animationDuration: { type: "number", default: 1000 }, // in ms
			animationDelay: { type: "number", default: 0 }, // in ms
			animationEasing: { type: "string", default: "ease" },
			animationOnce: { type: "boolean", default: true }, // Whether animation occurs only once
		};

		// Merge new attributes with existing ones
		settings.attributes = Object.assign({}, settings.attributes, newAttributes);

		return settings;
	}

	addFilter(
		"blocks.registerBlockType",
		"my-custom-plugin/add-text-block-attributes",
		addTextBlockAttributes,
	);

	// ... (Continue to Step 2)

	// 2. Add inspector controls
	const addTextBlockInspectorControls = createHigherOrderComponent(
		(BlockEdit) => {
			return (props) => {
				if (props.name !== "core/heading" && props.name !== "core/paragraph") {
					return createElement(BlockEdit, props);
				}

				const { attributes, setAttributes, isSelected } = props;
				const {
					fontWeight,
					lineHeight,
					animationType,
					animationDuration,
					animationDelay,
					animationEasing,
					animationOnce,
				} = attributes;

				return createElement(
					Fragment,
					null,
					createElement(BlockEdit, props),
					isSelected &&
						createElement(
							InspectorControls,
							null,
							// Typography Panel
							createElement(
								PanelBody,
								{ title: "Typography", initialOpen: true },
								createElement(SelectControl, {
									label: "Font Weight",
									value: fontWeight,
									options: [
										{ label: "Default", value: "" },
										{ label: "Normal", value: "normal" },
										{ label: "Bold", value: "bold" },
										{ label: "Bolder", value: "bolder" },
										{ label: "Lighter", value: "lighter" },
										{ label: "100", value: "100" },
										{ label: "200", value: "200" },
										{ label: "300", value: "300" },
										{ label: "400", value: "400" },
										{ label: "500", value: "500" },
										{ label: "600", value: "600" },
										{ label: "700", value: "700" },
										{ label: "800", value: "800" },
										{ label: "900", value: "900" },
									],
									onChange: (value) => setAttributes({ fontWeight: value }),
								}),
								createElement(TextControl, {
									label: "Line Height",
									value: lineHeight,
									onChange: (value) => setAttributes({ lineHeight: value }),
									help: "Enter line-height value with units (e.g., 1.5, 24px)",
								}),
							),
							// Animation Panel
							createElement(
								PanelBody,
								{ title: "Animation", initialOpen: false },
								createElement(SelectControl, {
									label: "Animation Type",
									value: animationType,
									options: [
										{ label: "None", value: "" },
										{ label: "Fade In", value: "fade-in" },
										{ label: "Fade In Up", value: "fade-in-up" },
										{ label: "Slide In Left", value: "slide-in-left" },
										{ label: "Slide In Right", value: "slide-in-right" },
										// Add more animation types as needed
									],
									onChange: (value) => setAttributes({ animationType: value }),
								}),
								createElement(RangeControl, {
									label: "Animation Duration (ms)",
									value: animationDuration,
									onChange: (value) =>
										setAttributes({ animationDuration: value }),
									min: 100,
									max: 5000,
									step: 100,
									help: "Duration of the animation in milliseconds",
								}),
								createElement(RangeControl, {
									label: "Animation Delay (ms)",
									value: animationDelay,
									onChange: (value) => setAttributes({ animationDelay: value }),
									min: 0,
									max: 5000,
									step: 100,
									help: "Delay before the animation starts in milliseconds",
								}),
								createElement(SelectControl, {
									label: "Animation Easing",
									value: animationEasing,
									options: [
										{ label: "Ease", value: "ease" },
										{ label: "Ease-In", value: "ease-in" },
										{ label: "Ease-Out", value: "ease-out" },
										{ label: "Ease-In-Out", value: "ease-in-out" },
										{ label: "Linear", value: "linear" },
									],
									onChange: (value) =>
										setAttributes({ animationEasing: value }),
								}),
								createElement(ToggleControl, {
									label: "Animate Only Once",
									checked: animationOnce,
									onChange: (value) => setAttributes({ animationOnce: value }),
									help: "If enabled, the animation will occur only once when the element enters the viewport.",
								}),
							),
						),
				);
			};
		},
		"withTextBlockInspectorControls",
	);

	addFilter(
		"editor.BlockEdit",
		"my-custom-plugin/add-text-block-inspector-controls",
		addTextBlockInspectorControls,
	);

	// 3. Modify save content to include custom styles and animation classes
	function addTextBlockSaveProps(extraProps, blockType, attributes) {
		if (
			blockType.name !== "core/heading" &&
			blockType.name !== "core/paragraph"
		) {
			return extraProps;
		}

		const {
			fontWeight,
			lineHeight,
			animationType,
			animationDuration,
			animationDelay,
			animationEasing,
			animationOnce,
		} = attributes;

		// Build style object
		let newStyle = extraProps.style || {};

		if (fontWeight && fontWeight !== "normal") {
			newStyle.fontWeight = fontWeight;
		}

		if (lineHeight && lineHeight !== "normal") {
			newStyle.lineHeight = lineHeight;
		}

		// Animation Styles
		if (animationType) {
			newStyle.animationName = animationType;
			newStyle.animationDuration = `${animationDuration}ms`;
			newStyle.animationDelay = `${animationDelay}ms`;
			newStyle.animationTimingFunction = animationEasing;
			newStyle.animationFillMode = animationOnce ? "forwards" : "both";
			newStyle.opacity = animationOnce ? 0 : 1; // Initial opacity for one-time animation
		}

		// Assign new styles
		extraProps.style = newStyle;

		// Add animation classes if using CSS classes for animations
		if (animationType) {
			extraProps.className = `${extraProps.className} animate-${animationType}`;
		}

		return extraProps;
	}

	addFilter(
		"blocks.getSaveContent.extraProps",
		"my-custom-plugin/add-text-block-save-props",
		addTextBlockSaveProps,
	);

	// Modify the addTextBlockSaveProps to use Animate.css classes
	function addTextBlockSaveProps(extraProps, blockType, attributes) {
		if (
			blockType.name !== "core/heading" &&
			blockType.name !== "core/paragraph"
		) {
			return extraProps;
		}

		const {
			fontWeight,
			lineHeight,
			animationType,
			animationDuration,
			animationDelay,
			animationEasing,
			animationOnce,
		} = attributes;

		// Animation class map for Animate.css
		const animationClassMap = {
			"fade-in": "animate__fadeIn",
			"fade-in-up": "animate__fadeInUp",
			"slide-in-left": "animate__slideInLeft",
			"slide-in-right": "animate__slideInRight",
			// Add more mappings as needed
		};

		// Build style object
		let newStyle = extraProps.style || {};

		if (fontWeight && fontWeight !== "normal") {
			newStyle.fontWeight = fontWeight;
		}

		if (lineHeight && lineHeight !== "normal") {
			newStyle.lineHeight = lineHeight;
		}

		// Animation Styles using Animate.css
		if (animationType && animationClassMap[animationType]) {
			// Directly assign CSS custom properties
			newStyle["animation-duration"] = `${animationDuration}ms`;
			newStyle["animation-delay"] = `${animationDelay}ms`;
			newStyle["animation-timing-function"] = animationEasing;
			newStyle["animation-fill-mode"] = animationOnce ? "forwards" : "both";

			// Optionally, set initial opacity if animationOnce
			if (animationOnce) {
				newStyle.opacity = 0;
			}
		}

		// Assign new styles
		extraProps.style = newStyle;

		// Add Animate.css classes
		if (animationType && animationClassMap[animationType]) {
			extraProps.className = `${extraProps.className} animate__animated ${animationClassMap[animationType]}`;
		}

		return extraProps;
	}

	addFilter(
		"blocks.getSaveContent.extraProps",
		"my-custom-plugin/add-text-block-save-props",
		addTextBlockSaveProps,
	);
})(window.wp);
