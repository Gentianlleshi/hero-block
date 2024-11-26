// extend-text-blocks.js
(function (wp) {
	const { addFilter } = wp.hooks;
	const { createHigherOrderComponent } = wp.compose;
	const { Fragment, createElement } = wp.element;
	const { InspectorControls } = wp.blockEditor || wp.editor;
	const {
		PanelBody,
		SelectControl,
		__experimentalUnitControl: UnitControl,
		TextControl, // Fallback if UnitControl is not available
	} = wp.components;

	// 1. Extend block attributes to include new style attributes
	function addTextBlockAttributes(settings, name) {
		if (name !== "core/heading" && name !== "core/paragraph") {
			return settings;
		}

		// Define new attributes
		const newAttributes = {
			fontWeight: { type: "string", default: "normal" },
			lineHeight: { type: "string", default: "normal" },
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

	// 2. Add inspector controls
	const addTextBlockInspectorControls = createHigherOrderComponent(
		(BlockEdit) => {
			return (props) => {
				if (props.name !== "core/heading" && props.name !== "core/paragraph") {
					return createElement(BlockEdit, props);
				}

				const { attributes, setAttributes, isSelected } = props;
				const { fontWeight, lineHeight } = attributes;

				return createElement(
					Fragment,
					null,
					createElement(BlockEdit, props),
					isSelected &&
						createElement(
							InspectorControls,
							null,
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
								UnitControl
									? createElement(UnitControl, {
											label: "Line Height",
											value: lineHeight,
											onChange: (value) => setAttributes({ lineHeight: value }),
											units: [
												{ value: "", label: "Default", default: "normal" },
												{ value: "px", label: "px", default: 16 },
												{ value: "em", label: "em", default: 1 },
												{ value: "rem", label: "rem", default: 1 },
												{ value: "%", label: "%", default: 100 },
											],
									  })
									: createElement(TextControl, {
											label: "Line Height",
											value: lineHeight,
											onChange: (value) => setAttributes({ lineHeight: value }),
											help: "Enter line-height value with units (e.g., 1.5, 24px)",
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

	// 3. Modify save content to include custom styles
	function addTextBlockSaveProps(extraProps, blockType, attributes) {
		if (
			blockType.name !== "core/heading" &&
			blockType.name !== "core/paragraph"
		) {
			return extraProps;
		}

		const { fontWeight, lineHeight } = attributes;

		// Build style object
		let newStyle = extraProps.style || {};

		if (fontWeight && fontWeight !== "normal") {
			newStyle.fontWeight = fontWeight;
		}

		if (lineHeight && lineHeight !== "normal") {
			newStyle.lineHeight = lineHeight;
		}

		// Assign new styles
		extraProps.style = newStyle;

		return extraProps;
	}

	addFilter(
		"blocks.getSaveContent.extraProps",
		"my-custom-plugin/add-text-block-save-props",
		addTextBlockSaveProps,
	);
})(window.wp);
