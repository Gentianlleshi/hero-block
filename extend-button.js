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
			boxShadowBlur: { type: "number", default: 5 },
			boxShadowSpread: { type: "number", default: 0 },
			boxShadowColor: { type: "string", default: "#000000" },
			boxShadowOpacity: { type: "number", default: 100 },
			// New attributes
			fontWeight: { type: "string", default: "normal" },
			lineHeight: { type: "string", default: "normal" },
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
			const { uniqueId } = attributes;

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

		const { uniqueId } = attributes;
		const uniqueClass = `custom-button-${uniqueId}`;

		// Add unique class to the button
		const newProps = {
			...element.props,
			className: [element.props.className, uniqueClass]
				.filter(Boolean)
				.join(" "),
		};

		// Generate styles
		const styles = generateButtonStyles(uniqueClass, attributes);

		// Create a style tag
		const styleTag = wp.element.createElement(
			"style",
			{ key: "custom-button-styles" },
			styles,
		);

		// Return element with style tag
		return wp.element.createElement("div", null, [
			styleTag,
			wp.element.cloneElement(element, newProps),
		]);
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
