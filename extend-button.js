// extend-button-block.js
(function (wp) {
	const { addFilter } = wp.hooks;
	const { createHigherOrderComponent } = wp.compose;
	const { Fragment } = wp.element;
	const { InspectorControls } = wp.blockEditor || wp.editor;
	const {
		PanelBody,
		RangeControl,
		SelectControl,
		ColorPicker,
		ToggleControl,
		TextControl,
		__experimentalUnitControl: UnitControl, // For line-height
	} = wp.components;

	// 1. Extend block attributes to include new style attributes
	function addButtonAttributes(settings, name) {
		if (name !== "core/button") {
			return settings;
		}

		// Define new attributes
		const newAttributes = {
			uniqueId: { type: "string" },
			borderColor: { type: "string", default: "#000000" },
			borderWidth: { type: "number", default: 1 },
			borderRadius: { type: "number", default: 0 },
			backgroundColor: { type: "string", default: "#ffffff" },
			backgroundOpacity: { type: "number", default: 100 },
			boxShadowType: { type: "string", default: "outline" },
			boxShadowOffsetX: { type: "number", default: 0 },
			boxShadowOffsetY: { type: "number", default: 0 },
			boxShadowBlur: { type: "number", default: 0 },
			boxShadowSpread: { type: "number", default: 0 },
			boxShadowColor: { type: "string", default: "#000000" },
			boxShadowOpacity: { type: "number", default: 100 },
			// New attributes
			fontWeight: { type: "string", default: "normal" },
			lineHeight: { type: "string", default: "normal" },
			// Animation Attributes
			enableAnimation: { type: "boolean", default: false },
			animationType: { type: "string", default: "" },
			animationDuration: { type: "number", default: 1000 },
			animationDelay: { type: "number", default: 0 },
			animationEasing: { type: "string", default: "ease" },
			animationOnce: { type: "boolean", default: true },
			// Animation Properties
			animateOpacity: { type: "boolean", default: false },
			opacityFrom: { type: "number", default: 1 },
			opacityTo: { type: "number", default: 1 },

			animateX: { type: "boolean", default: false },
			xFrom: { type: "string", default: "0" },
			xTo: { type: "string", default: "0" },

			animateY: { type: "boolean", default: false },
			yFrom: { type: "string", default: "0" },
			yTo: { type: "string", default: "0" },

			animateScale: { type: "boolean", default: false },
			scaleFrom: { type: "number", default: 1 },
			scaleTo: { type: "number", default: 1 },

			animateRotation: { type: "boolean", default: false },
			rotationFrom: { type: "number", default: 0 },
			rotationTo: { type: "number", default: 0 },
		};

		// Merge new attributes with existing ones
		settings.attributes = Object.assign({}, settings.attributes, newAttributes);

		return settings;
	}

	addFilter(
		"blocks.registerBlockType",
		"my-custom-plugin/add-button-attributes",
		addButtonAttributes,
	);

	// 2. Add inspector controls
	const addButtonInspectorControls = createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			if (props.name !== "core/button") {
				return wp.element.createElement(BlockEdit, props);
			}

			const { attributes, setAttributes, isSelected, clientId } = props;

			const {
				uniqueId = clientId,
				borderColor,
				borderWidth,
				borderRadius,
				backgroundColor,
				backgroundOpacity,
				boxShadowType,
				boxShadowOffsetX,
				boxShadowOffsetY,
				boxShadowBlur,
				boxShadowSpread,
				boxShadowColor,
				boxShadowOpacity,
				fontWeight,
				lineHeight,
				enableAnimation,
				animationType,
				animationDuration,
				animationDelay,
				animationEasing,
				animationOnce,
				// New animation properties
				animateOpacity,
				opacityFrom,
				opacityTo,
				animateX,
				xFrom,
				xTo,
				animateY,
				yFrom,
				yTo,
				animateScale,
				scaleFrom,
				scaleTo,
				animateRotation,
				rotationFrom,
				rotationTo,
			} = attributes;

			// Ensure uniqueId is set
			if (!attributes.uniqueId) {
				setAttributes({ uniqueId: clientId });
			}

			return wp.element.createElement(
				Fragment,
				null,
				wp.element.createElement(BlockEdit, props),
				isSelected &&
					wp.element.createElement(
						InspectorControls,
						null,
						wp.element.createElement(
							PanelBody,
							{ title: "Typography", initialOpen: false },
							wp.element.createElement(SelectControl, {
								label: "Font Weight",
								value: fontWeight,
								options: [
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
							wp.element.createElement(UnitControl, {
								label: "Line Height",
								value: lineHeight,
								onChange: (value) => setAttributes({ lineHeight: value }),
								units: [
									{ value: "px", label: "px", default: 16 },
									{ value: "em", label: "em", default: 1 },
									{ value: "rem", label: "rem", default: 1 },
									{ value: "%", label: "%", default: 100 },
									{ value: "", label: "none", default: "normal" },
								],
							}),
						),
						wp.element.createElement(
							PanelBody,
							{ title: "Border Styles", initialOpen: false },
							wp.element.createElement(ColorPicker, {
								label: "Border Color",
								color: borderColor,
								onChangeComplete: (value) =>
									setAttributes({ borderColor: value.hex }),
							}),
							wp.element.createElement(RangeControl, {
								label: "Border Width",
								value: borderWidth,
								onChange: (value) => setAttributes({ borderWidth: value }),
								min: 0,
								max: 10,
							}),
							wp.element.createElement(RangeControl, {
								label: "Border Radius",
								value: borderRadius,
								onChange: (value) => setAttributes({ borderRadius: value }),
								min: 0,
								max: 50,
							}),
						),
						wp.element.createElement(
							PanelBody,
							{ title: "Background Styles", initialOpen: false },
							wp.element.createElement(ColorPicker, {
								label: "Background Color",
								color: backgroundColor,
								onChangeComplete: (value) =>
									setAttributes({ backgroundColor: value.hex }),
							}),
							wp.element.createElement(RangeControl, {
								label: "Background Opacity",
								value: backgroundOpacity,
								onChange: (value) =>
									setAttributes({ backgroundOpacity: value }),
								min: 0,
								max: 100,
							}),
						),
						wp.element.createElement(
							PanelBody,
							{ title: "Box Shadow Styles", initialOpen: false },
							wp.element.createElement(SelectControl, {
								label: "Box Shadow Type",
								value: boxShadowType,
								options: [
									{ label: "Outline", value: "outline" },
									{ label: "Inset", value: "inset" },
								],
								onChange: (value) => setAttributes({ boxShadowType: value }),
							}),
							wp.element.createElement(RangeControl, {
								label: "Offset X",
								value: boxShadowOffsetX,
								onChange: (value) => setAttributes({ boxShadowOffsetX: value }),
								min: -50,
								max: 50,
							}),
							wp.element.createElement(RangeControl, {
								label: "Offset Y",
								value: boxShadowOffsetY,
								onChange: (value) => setAttributes({ boxShadowOffsetY: value }),
								min: -50,
								max: 50,
							}),
							wp.element.createElement(RangeControl, {
								label: "Blur Radius",
								value: boxShadowBlur,
								onChange: (value) => setAttributes({ boxShadowBlur: value }),
								min: 0,
								max: 100,
							}),
							wp.element.createElement(RangeControl, {
								label: "Spread Radius",
								value: boxShadowSpread,
								onChange: (value) => setAttributes({ boxShadowSpread: value }),
								min: -50,
								max: 50,
							}),
							wp.element.createElement(ColorPicker, {
								label: "Shadow Color",
								color: boxShadowColor,
								onChangeComplete: (value) =>
									setAttributes({ boxShadowColor: value.hex }),
							}),
							wp.element.createElement(RangeControl, {
								label: "Shadow Opacity",
								value: boxShadowOpacity,
								onChange: (value) => setAttributes({ boxShadowOpacity: value }),
								min: 0,
								max: 100,
							}),
						),
						// Animation Panel
						wp.element.createElement(
							PanelBody,
							{ title: "Animation", initialOpen: false },
							// Toggle to enable or disable animations
							wp.element.createElement(ToggleControl, {
								label: "Enable Animation",
								checked: enableAnimation,
								onChange: (value) => {
									setAttributes({ enableAnimation: value });
									if (!value) {
										// Reset animation attributes when disabling animations
										setAttributes({
											// Reset main animation settings
											animationDuration: 1000,
											animationDelay: 0,
											animationEasing: "ease",
											animationOnce: true,
											// Reset animation properties
											animateOpacity: false,
											opacityFrom: 0,
											opacityTo: 1,
											animateX: false,
											xFrom: "0",
											xTo: "0",
											animateY: false,
											yFrom: "0",
											yTo: "0",
											animateScale: false,
											scaleFrom: 1,
											scaleTo: 1,
											animateRotation: false,
											rotationFrom: 0,
											rotationTo: 0,
										});
									}
								},
							}),
							// Conditionally render animation controls
							enableAnimation &&
								wp.element.createElement(
									Fragment,
									null,
									wp.element.createElement(RangeControl, {
										label: "Animation Duration (ms)",
										value: animationDuration,
										onChange: (value) =>
											setAttributes({ animationDuration: value }),
										min: 100,
										max: 5000,
										step: 100,
										help: "Duration of the animation in milliseconds",
									}),
									wp.element.createElement(RangeControl, {
										label: "Animation Delay (ms)",
										value: animationDelay,
										onChange: (value) =>
											setAttributes({ animationDelay: value }),
										min: 0,
										max: 5000,
										step: 100,
										help: "Delay before the animation starts in milliseconds",
									}),
									wp.element.createElement(SelectControl, {
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
									wp.element.createElement(ToggleControl, {
										label: "Animate Only Once",
										checked: animationOnce,
										onChange: (value) =>
											setAttributes({ animationOnce: value }),
										help: "If enabled, the animation will occur only once when the element enters the viewport.",
									}),
									// Animation Properties
									wp.element.createElement(
										PanelBody,
										{ title: "Animation Properties", initialOpen: false },
										// Animate Opacity
										wp.element.createElement(ToggleControl, {
											label: "Animate Opacity",
											checked: animateOpacity,
											onChange: (value) =>
												setAttributes({ animateOpacity: value }),
										}),
										animateOpacity &&
											wp.element.createElement(
												Fragment,
												null,
												wp.element.createElement(RangeControl, {
													label: "From Opacity",
													value: opacityFrom,
													onChange: (value) =>
														setAttributes({ opacityFrom: value }),
													min: 0,
													max: 1,
													step: 0.1,
												}),
												wp.element.createElement(RangeControl, {
													label: "To Opacity",
													value: opacityTo,
													onChange: (value) =>
														setAttributes({ opacityTo: value }),
													min: 0,
													max: 1,
													step: 0.1,
												}),
											),
										// Animate X
										wp.element.createElement(ToggleControl, {
											label: "Animate X",
											checked: animateX,
											onChange: (value) => setAttributes({ animateX: value }),
										}),
										animateX &&
											wp.element.createElement(
												Fragment,
												null,
												wp.element.createElement(TextControl, {
													label: "From X (e.g., -100, 0%)",
													value: xFrom,
													onChange: (value) => setAttributes({ xFrom: value }),
												}),
												wp.element.createElement(TextControl, {
													label: "To X (e.g., 0, 100%)",
													value: xTo,
													onChange: (value) => setAttributes({ xTo: value }),
												}),
											),
										// Animate Y
										wp.element.createElement(ToggleControl, {
											label: "Animate Y",
											checked: animateY,
											onChange: (value) => setAttributes({ animateY: value }),
										}),
										animateY &&
											wp.element.createElement(
												Fragment,
												null,
												wp.element.createElement(TextControl, {
													label: "From Y (e.g., -100, 0%)",
													value: yFrom,
													onChange: (value) => setAttributes({ yFrom: value }),
												}),
												wp.element.createElement(TextControl, {
													label: "To Y (e.g., 0, 100%)",
													value: yTo,
													onChange: (value) => setAttributes({ yTo: value }),
												}),
											),
										// Animate Scale
										wp.element.createElement(ToggleControl, {
											label: "Animate Scale",
											checked: animateScale,
											onChange: (value) =>
												setAttributes({ animateScale: value }),
										}),
										animateScale &&
											wp.element.createElement(
												Fragment,
												null,
												wp.element.createElement(RangeControl, {
													label: "From Scale",
													value: scaleFrom,
													onChange: (value) =>
														setAttributes({ scaleFrom: value }),
													min: 0,
													max: 3,
													step: 0.1,
												}),
												wp.element.createElement(RangeControl, {
													label: "To Scale",
													value: scaleTo,
													onChange: (value) =>
														setAttributes({ scaleTo: value }),
													min: 0,
													max: 3,
													step: 0.1,
												}),
											),
										// Animate Rotation
										wp.element.createElement(ToggleControl, {
											label: "Animate Rotation",
											checked: animateRotation,
											onChange: (value) =>
												setAttributes({ animateRotation: value }),
										}),
										animateRotation &&
											wp.element.createElement(
												Fragment,
												null,
												wp.element.createElement(RangeControl, {
													label: "From Rotation (degrees)",
													value: rotationFrom,
													onChange: (value) =>
														setAttributes({ rotationFrom: value }),
													min: -360,
													max: 360,
													step: 1,
												}),
												wp.element.createElement(RangeControl, {
													label: "To Rotation (degrees)",
													value: rotationTo,
													onChange: (value) =>
														setAttributes({ rotationTo: value }),
													min: -360,
													max: 360,
													step: 1,
												}),
											),
									),
								),
						),
					),
			);
		};
	}, "withInspectorControls");

	addFilter(
		"editor.BlockEdit",
		"my-custom-plugin/add-button-inspector-controls",
		addButtonInspectorControls,
	);

	// 3. Apply custom styles in the editor
	const withCustomStyles = createHigherOrderComponent((BlockListBlock) => {
		return (props) => {
			if (props.block.name !== "core/button") {
				return wp.element.createElement(BlockListBlock, props);
			}

			const { attributes } = props.block;
			const { uniqueId, enableAnimation } = attributes;

			// Generate unique class
			const uniqueClass = `custom-button-${uniqueId || props.block.clientId}`;

			// Generate styles
			const styles = generateButtonStyles(uniqueClass, attributes);

			// Inject styles into editor
			injectEditorStyles(uniqueClass, styles);

			// Add unique class to the block
			const blockProps = {
				...props,
				className: [props.className, uniqueClass].filter(Boolean).join(" "),
			};

			// If animation is enabled, add class to identify elements to animate
			if (enableAnimation) {
				blockProps.className += " gsap-animate-element";
			}

			return wp.element.createElement(BlockListBlock, blockProps);
		};
	}, "withCustomStyles");

	addFilter(
		"editor.BlockListBlock",
		"my-custom-plugin/with-custom-styles",
		withCustomStyles,
	);

	// 4. Modify save element to include styles on the front-end
	function modifyButtonSave(element, blockType, attributes) {
		if (blockType.name !== "core/button") {
			return element;
		}

		const {
			uniqueId,
			enableAnimation,
			animationType,
			animationDuration,
			animationDelay,
			animationEasing,
			animationOnce,
			// Animation properties
			animateOpacity,
			opacityFrom,
			opacityTo,
			animateX,
			xFrom,
			xTo,
			animateY,
			yFrom,
			yTo,
			animateScale,
			scaleFrom,
			scaleTo,
			animateRotation,
			rotationFrom,
			rotationTo,
		} = attributes;

		const uniqueClass = `custom-button-${uniqueId}`;

		// Add unique class to the button
		const newProps = {
			...element.props,
			className: [element.props.className, uniqueClass]
				.filter(Boolean)
				.join(" "),
		};

		// Add data attributes for GSAP if animation is enabled
		// Clone the inner <a> element to add data attributes and class
		let innerElement = element.props.children;

		if (enableAnimation && innerElement && innerElement.props) {
			let innerProps = { ...innerElement.props };

			let animationProperties = {};

			let fromVars = {};
			let toVars = {};

			if (animateOpacity) {
				fromVars.opacity = parseFloat(opacityFrom);
				toVars.opacity = parseFloat(opacityTo);
			}

			if (animateX) {
				fromVars.x = xFrom;
				toVars.x = xTo;
			}

			if (animateY) {
				fromVars.y = yFrom;
				toVars.y = yTo;
			}

			if (animateScale) {
				fromVars.scale = parseFloat(scaleFrom);
				toVars.scale = parseFloat(scaleTo);
			}

			if (animateRotation) {
				fromVars.rotation = parseFloat(rotationFrom);
				toVars.rotation = parseFloat(rotationTo);
			}

			animationProperties.fromVars = fromVars;
			animationProperties.toVars = toVars;

			// Store as JSON string in data attribute
			innerProps["data-animation-properties"] =
				JSON.stringify(animationProperties);

			// Include other animation settings
			innerProps["data-animation-duration"] = animationDuration;
			innerProps["data-animation-delay"] = animationDelay;
			innerProps["data-animation-easing"] = animationEasing;
			innerProps["data-animation-once"] = animationOnce ? "true" : "false";

			// Add class to identify elements to animate
			innerProps.className =
				(innerProps.className || "") + " gsap-animate-element";

			// Clone the inner element with new props
			innerElement = wp.element.cloneElement(innerElement, innerProps);
		}

		// Clone the outer element with new props and updated children
		const newElement = wp.element.cloneElement(element, newProps, innerElement);

		// Generate styles
		const styles = generateButtonStyles(uniqueClass, attributes);

		// Create a style tag
		const styleTag = wp.element.createElement(
			"style",
			{ key: "custom-button-styles" },
			styles,
		);

		// Return element with style tag
		return wp.element.createElement("div", null, [styleTag, newElement]);
	}

	addFilter(
		"blocks.getSaveElement",
		"my-custom-plugin/modify-button-save",
		modifyButtonSave,
	);

	// Helper functions
	function generateButtonStyles(uniqueClass, attributes) {
		const {
			borderColor,
			borderWidth,
			borderRadius,
			backgroundColor,
			backgroundOpacity,
			boxShadowType,
			boxShadowOffsetX,
			boxShadowOffsetY,
			boxShadowBlur,
			boxShadowSpread,
			boxShadowColor,
			boxShadowOpacity,
			fontWeight,
			lineHeight,
		} = attributes;

		const rgbaBackgroundColor = hexToRgba(
			backgroundColor,
			backgroundOpacity / 100,
		);
		const rgbaBoxShadowColor = hexToRgba(
			boxShadowColor,
			boxShadowOpacity / 100,
		);

		const boxShadow = `${
			boxShadowType === "inset" ? "inset " : ""
		}${boxShadowOffsetX}px ${boxShadowOffsetY}px ${boxShadowBlur}px ${boxShadowSpread}px ${rgbaBoxShadowColor}`;

		const styles = `
          .${uniqueClass} > .wp-block-button__link {
            border: ${borderWidth}px solid ${borderColor};
            border-radius: ${borderRadius}px !important;
            background-color: ${rgbaBackgroundColor};
            box-shadow: ${boxShadow};
            font-weight: ${fontWeight};
            line-height: ${lineHeight};
          }
        `;
		return styles;
	}

	function injectEditorStyles(uniqueClass, styles) {
		const styleTagId = `custom-style-${uniqueClass}`;
		let styleTag = document.getElementById(styleTagId);

		if (!styleTag) {
			styleTag = document.createElement("style");
			styleTag.id = styleTagId;
			document.head.appendChild(styleTag);
		}
		styleTag.innerHTML = styles;
	}

	function hexToRgba(hex, opacity) {
		if (!hex || typeof hex !== "string") {
			hex = "#000000";
		}

		hex = hex.replace("#", "");
		const r = parseInt(hex.substring(0, 2), 16) || 0;
		const g = parseInt(hex.substring(2, 4), 16) || 0;
		const b = parseInt(hex.substring(4, 6), 16) || 0;
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}
})(window.wp);
