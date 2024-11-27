import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
} from "@wordpress/block-editor";
import {
	PanelBody,
	SelectControl,
	RangeControl,
	Button,
	ColorPicker,
	ToggleControl,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from "@wordpress/components";
import "./editor.scss";

import { useEffect } from "@wordpress/element";

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		layout,
		columns,
		columnsLaptop,
		columnsTablet,
		columnsMobile,
		justifyContent,
		alignItems,
		placeContent,
		gap,
		gapUnit,
		flexDirection,
		backgroundImage,
		gradientColors,
		gradientAngle,
		backgroundImageZIndex,
		gradientZIndex,
		enableBackgroundImage,
		enableBackgroundGradient,
		backgroundSize,
		backgroundPosition,
		backgroundRepeat,
		uniqueClass,
		height,
		minHeight,
		maxHeight,
		width,
		minWidth,
		maxWidth,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		flexWrap,
		flexBasis,
	} = attributes;

	// Set uniqueClass if not set
	// if (!uniqueClass) {
	// 	setAttributes({ uniqueClass: `hero-block-${clientId}` });
	// }
	useEffect(() => {
		if (!uniqueClass) {
			setAttributes({ uniqueClass: `hero-block-${clientId}` });
		}
	}, [uniqueClass, clientId, setAttributes]);

	const hasBackgroundImage = enableBackgroundImage;
	const hasBackgroundGradient = enableBackgroundGradient;

	const style = {
		display: layout,
		...(layout === "flex" && {
			justifyContent,
			alignItems: alignItems || "stretch", // Ensure alignItems defaults to 'stretch'
			flexDirection,
			flexWrap,
			"--flex-basis": flexBasis || "auto",
		}),
		...(layout !== "block" && {
			gap: `${gap}${gapUnit}`,
		}),
		...(hasBackgroundImage && {
			position: "relative",
			"--background-image": backgroundImage
				? `url(${backgroundImage})`
				: "none",
			"--background-image-z-index": backgroundImageZIndex,
			"--background-size": backgroundSize,
			"--background-position": backgroundPosition,
			"--background-repeat": backgroundRepeat,
		}),
		...(hasBackgroundGradient && {
			position: "relative",
			"--gradient": gradientColors.length
				? `linear-gradient(${gradientAngle}deg, ${gradientColors.join(", ")})`
				: "none",
			"--gradient-z-index": gradientZIndex,
		}),
		// Dimensions and Spacing
		...(height && { height }),
		...(minHeight && { minHeight }),
		...(maxHeight && { maxHeight }),
		...(width && { width }),
		...(minWidth && { minWidth }),
		...(maxWidth && { maxWidth }),
		...(paddingTop && { paddingTop }),
		...(paddingRight && { paddingRight }),
		...(paddingBottom && { paddingBottom }),
		...(paddingLeft && { paddingLeft }),
		...(marginTop && { marginTop }),
		...(marginRight && { marginRight }),
		...(marginBottom && { marginBottom }),
		...(marginLeft && { marginLeft }),
	};

	const className = `${uniqueClass} hero-block ${
		hasBackgroundImage ? "has-background-image" : ""
	} ${hasBackgroundGradient ? "has-background-gradient" : ""}`;

	const blockProps = useBlockProps({
		className,
		style,
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: [
			"core/paragraph",
			"core/image",
			"core/heading",
			"core/button",
			"create-block/hero-block",
		],
	});

	// Build styles
	const baseStyles = `
    .${uniqueClass} {
      display: ${layout};
      ${
				layout === "grid"
					? `grid-template-columns: repeat(${columns || 1}, 1fr);`
					: ""
			}
      ${layout === "grid" ? `grid-auto-rows: 1fr;` : ""}
      ${
				layout === "grid" && placeContent
					? `place-content: ${placeContent};`
					: ""
			}
    }
  `;

	const laptopStyles = columnsLaptop
		? `
      @media (min-width: 1025px) and (max-width: 1440px) {
        .${uniqueClass} {
          grid-template-columns: repeat(${columnsLaptop}, 1fr) !important;
        }
      }
    `
		: "";

	const tabletStyles = columnsTablet
		? `
      @media (max-width: 1024px) and (min-width: 768px) {
        .${uniqueClass} {
          grid-template-columns: repeat(${columnsTablet}, 1fr) !important;
        }
      }
    `
		: "";

	const mobileStyles = columnsMobile
		? `
      @media (max-width: 767px) {
        .${uniqueClass} {
          grid-template-columns: repeat(${columnsMobile}, 1fr) !important;
        }
      }
    `
		: "";

	const allStyles = baseStyles + laptopStyles + tabletStyles + mobileStyles;

	return (
		<>
			<InspectorControls>
				{/* Layout Settings Panel */}
				<PanelBody title={__("Layout Settings", "hero-block")}>
					{/* Layout Type Control */}
					<SelectControl
						label={__("Layout Type", "hero-block")}
						value={layout}
						options={[
							{ label: __("Block", "hero-block"), value: "block" },
							{ label: __("Flex", "hero-block"), value: "flex" },
							{ label: __("Grid", "hero-block"), value: "grid" },
						]}
						onChange={(value) => setAttributes({ layout: value })}
					/>
					{/* Additional Controls based on Layout */}
					{layout === "flex" && (
						<>
							{/* Justify Content Control */}
							<SelectControl
								label={__("Justify Content", "hero-block")}
								value={justifyContent}
								options={[
									{
										label: __("Flex Start", "hero-block"),
										value: "flex-start",
									},
									{ label: __("Center", "hero-block"), value: "center" },
									{ label: __("Flex End", "hero-block"), value: "flex-end" },
									{
										label: __("Space Between", "hero-block"),
										value: "space-between",
									},
									{
										label: __("Space Around", "hero-block"),
										value: "space-around",
									},
									{
										label: __("Space Evenly", "hero-block"),
										value: "space-evenly",
									},
								]}
								onChange={(value) => setAttributes({ justifyContent: value })}
							/>
							{/* Flex Direction Control */}
							<SelectControl
								label={__("Flex Direction", "hero-block")}
								value={flexDirection}
								options={[
									{ label: __("Row", "hero-block"), value: "row" },
									{
										label: __("Row Reverse", "hero-block"),
										value: "row-reverse",
									},
									{ label: __("Column", "hero-block"), value: "column" },
									{
										label: __("Column Reverse", "hero-block"),
										value: "column-reverse",
									},
								]}
								onChange={(value) => setAttributes({ flexDirection: value })}
							/>
							{/* Align Items Control */}
							<SelectControl
								label={__("Align Items", "hero-block")}
								value={alignItems}
								options={[
									{ label: __("Stretch", "hero-block"), value: "stretch" },
									{
										label: __("Flex Start", "hero-block"),
										value: "flex-start",
									},
									{ label: __("Center", "hero-block"), value: "center" },
									{ label: __("Flex End", "hero-block"), value: "flex-end" },
									{ label: __("Baseline", "hero-block"), value: "baseline" },
								]}
								onChange={(value) => setAttributes({ alignItems: value })}
							/>
							{/* Flex Wrap Control */}
							<SelectControl
								label={__("Flex Wrap", "hero-block")}
								value={flexWrap}
								options={[
									{ label: __("No Wrap", "hero-block"), value: "nowrap" },
									{ label: __("Wrap", "hero-block"), value: "wrap" },
									{
										label: __("Wrap Reverse", "hero-block"),
										value: "wrap-reverse",
									},
								]}
								onChange={(value) => setAttributes({ flexWrap: value })}
							/>
							{/* Flex Basis Control */}
							<TextControl
								label={__("Flex Basis", "hero-block")}
								value={flexBasis}
								onChange={(value) => setAttributes({ flexBasis: value })}
								help={__(
									"Enter value with units (e.g., 100px, 50%, auto)",
									"hero-block",
								)}
							/>
						</>
					)}
					{layout === "grid" && (
						<>
							{/* Number of Columns Control (Desktop) */}
							<RangeControl
								label={__("Number of Columns (Desktop)", "hero-block")}
								value={columns}
								onChange={(value) => setAttributes({ columns: value })}
								min={1}
								max={6}
							/>
							{/* Number of Columns Control (Laptop) */}
							<RangeControl
								label={__("Number of Columns (Laptop)", "hero-block")}
								value={columnsLaptop}
								onChange={(value) => setAttributes({ columnsLaptop: value })}
								min={1}
								max={6}
								help={__(
									"Optional. Defaults to Desktop columns if not set.",
									"hero-block",
								)}
							/>

							{/* Number of Columns Control (Tablet) */}
							<RangeControl
								label={__("Number of Columns (Tablet)", "hero-block")}
								value={columnsTablet}
								onChange={(value) => setAttributes({ columnsTablet: value })}
								min={1}
								max={6}
								help={__(
									"Optional. Defaults to Laptop columns if not set.",
									"hero-block",
								)}
							/>
							{/* Number of Columns Control (Mobile) */}
							<RangeControl
								label={__("Number of Columns (Mobile)", "hero-block")}
								value={columnsMobile}
								onChange={(value) => setAttributes({ columnsMobile: value })}
								min={1}
								max={6}
								help={__(
									"Optional. Defaults to Tablet columns if not set.",
									"hero-block",
								)}
							/>
							{/* Place Content Control */}
							<SelectControl
								label={__("Place Content", "hero-block")}
								value={placeContent}
								options={[
									{ label: __("Normal", "hero-block"), value: "normal" },
									{ label: __("Center", "hero-block"), value: "center" },
									{ label: __("Start", "hero-block"), value: "start" },
									{ label: __("End", "hero-block"), value: "end" },
									{
										label: __("Space Between", "hero-block"),
										value: "space-between",
									},
									{
										label: __("Space Around", "hero-block"),
										value: "space-around",
									},
									{
										label: __("Space Evenly", "hero-block"),
										value: "space-evenly",
									},
									{ label: __("Stretch", "hero-block"), value: "stretch" },
								]}
								onChange={(value) => setAttributes({ placeContent: value })}
							/>
						</>
					)}
					{(layout === "flex" || layout === "grid") && (
						<>
							{/* Gap Control */}
							<RangeControl
								label={__("Gap", "hero-block")}
								value={gap}
								onChange={(value) => setAttributes({ gap: value })}
								min={0}
								max={100}
							/>
							{/* Gap Unit Control */}
							<SelectControl
								label={__("Gap Unit", "hero-block")}
								value={gapUnit}
								options={[
									{ label: __("Pixels", "hero-block"), value: "px" },
									{ label: __("Rem", "hero-block"), value: "rem" },
									{ label: __("Em", "hero-block"), value: "em" },
									{ label: __("Percentage", "hero-block"), value: "%" },
								]}
								onChange={(value) => setAttributes({ gapUnit: value })}
							/>
						</>
					)}
				</PanelBody>

				{/* Dimensions and Spacing Panel */}
				<PanelBody
					title={__("Dimensions and Spacing", "hero-block")}
					initialOpen={false}
				>
					{/* Dimensions */}
					<p>{__("Dimensions", "hero-block")}</p>
					<TextControl
						label={__("Height", "hero-block")}
						value={height}
						onChange={(value) => setAttributes({ height: value })}
						help={__(
							"Enter value with units (e.g., 100px, 50%, 10vh)",
							"hero-block",
						)}
					/>
					<TextControl
						label={__("Min Height", "hero-block")}
						value={minHeight}
						onChange={(value) => setAttributes({ minHeight: value })}
						help={__("Enter value with units", "hero-block")}
					/>
					<TextControl
						label={__("Max Height", "hero-block")}
						value={maxHeight}
						onChange={(value) => setAttributes({ maxHeight: value })}
						help={__("Enter value with units", "hero-block")}
					/>
					<TextControl
						label={__("Width", "hero-block")}
						value={width}
						onChange={(value) => setAttributes({ width: value })}
						help={__("Enter value with units", "hero-block")}
					/>
					<TextControl
						label={__("Min Width", "hero-block")}
						value={minWidth}
						onChange={(value) => setAttributes({ minWidth: value })}
						help={__("Enter value with units", "hero-block")}
					/>
					<TextControl
						label={__("Max Width", "hero-block")}
						value={maxWidth}
						onChange={(value) => setAttributes({ maxWidth: value })}
						help={__("Enter value with units", "hero-block")}
					/>

					{/* Padding */}
					<p>{__("Padding", "hero-block")}</p>
					<TextControl
						label={__("Padding Top", "hero-block")}
						value={paddingTop}
						onChange={(value) => setAttributes({ paddingTop: value })}
						help={__("Enter value with units", "hero-block")}
					/>
					<TextControl
						label={__("Padding Right", "hero-block")}
						value={paddingRight}
						onChange={(value) => setAttributes({ paddingRight: value })}
						help={__("Enter value with units", "hero-block")}
					/>
					<TextControl
						label={__("Padding Bottom", "hero-block")}
						value={paddingBottom}
						onChange={(value) => setAttributes({ paddingBottom: value })}
						help={__("Enter value with units", "hero-block")}
					/>
					<TextControl
						label={__("Padding Left", "hero-block")}
						value={paddingLeft}
						onChange={(value) => setAttributes({ paddingLeft: value })}
						help={__("Enter value with units", "hero-block")}
					/>

					{/* Margin */}
					<p>{__("Margin", "hero-block")}</p>
					<TextControl
						label={__("Margin Top", "hero-block")}
						value={marginTop}
						onChange={(value) => setAttributes({ marginTop: value })}
						help={__("Enter value with units", "hero-block")}
					/>
					<TextControl
						label={__("Margin Right", "hero-block")}
						value={marginRight}
						onChange={(value) => setAttributes({ marginRight: value })}
						help={__("Enter value with units", "hero-block")}
					/>
					<TextControl
						label={__("Margin Bottom", "hero-block")}
						value={marginBottom}
						onChange={(value) => setAttributes({ marginBottom: value })}
						help={__("Enter value with units", "hero-block")}
					/>
					<TextControl
						label={__("Margin Left", "hero-block")}
						value={marginLeft}
						onChange={(value) => setAttributes({ marginLeft: value })}
						help={__("Enter value with units", "hero-block")}
					/>
				</PanelBody>

				{/* Backgrounds Panel */}
				<PanelBody title={__("Backgrounds", "hero-block")} initialOpen={false}>
					{/* Enable Background Image Toggle */}
					<ToggleControl
						label={__("Enable Background Image", "hero-block")}
						checked={enableBackgroundImage}
						onChange={(value) =>
							setAttributes({ enableBackgroundImage: value })
						}
					/>

					{/* Background Image Controls */}
					{enableBackgroundImage && (
						<>
							{/* Background Image Control */}
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) =>
										setAttributes({ backgroundImage: media.url })
									}
									allowedTypes={["image"]}
									value={backgroundImage}
									render={({ open }) => (
										<Button onClick={open} isPrimary>
											{backgroundImage
												? __("Change Background Image", "hero-block")
												: __("Set Background Image", "hero-block")}
										</Button>
									)}
								/>
							</MediaUploadCheck>
							{backgroundImage && (
								<Button
									onClick={() => setAttributes({ backgroundImage: "" })}
									isDestructive
									style={{ marginTop: "10px" }}
								>
									{__("Remove Background Image", "hero-block")}
								</Button>
							)}

							{/* Background Size Control */}
							<SelectControl
								label={__("Background Size", "hero-block")}
								value={backgroundSize}
								options={[
									{ label: __("Auto", "hero-block"), value: "auto" },
									{ label: __("Cover", "hero-block"), value: "cover" },
									{ label: __("Contain", "hero-block"), value: "contain" },
								]}
								onChange={(value) => setAttributes({ backgroundSize: value })}
							/>

							{/* Background Position Control */}
							<SelectControl
								label={__("Background Position", "hero-block")}
								value={backgroundPosition}
								options={[
									{
										label: __("Center Center", "hero-block"),
										value: "center center",
									},
									{
										label: __("Center Left", "hero-block"),
										value: "center left",
									},
									{
										label: __("Center Right", "hero-block"),
										value: "center right",
									},
									{
										label: __("Top Center", "hero-block"),
										value: "top center",
									},
									{ label: __("Top Left", "hero-block"), value: "top left" },
									{ label: __("Top Right", "hero-block"), value: "top right" },
									{
										label: __("Bottom Center", "hero-block"),
										value: "bottom center",
									},
									{
										label: __("Bottom Left", "hero-block"),
										value: "bottom left",
									},
									{
										label: __("Bottom Right", "hero-block"),
										value: "bottom right",
									},
								]}
								onChange={(value) =>
									setAttributes({ backgroundPosition: value })
								}
							/>

							{/* Background Repeat Control */}
							<SelectControl
								label={__("Background Repeat", "hero-block")}
								value={backgroundRepeat}
								options={[
									{ label: __("No Repeat", "hero-block"), value: "no-repeat" },
									{ label: __("Repeat", "hero-block"), value: "repeat" },
									{ label: __("Repeat X", "hero-block"), value: "repeat-x" },
									{ label: __("Repeat Y", "hero-block"), value: "repeat-y" },
								]}
								onChange={(value) => setAttributes({ backgroundRepeat: value })}
							/>

							{/* Background Image Z-Index Control */}
							<NumberControl
								label={__("Background Image Z-Index", "hero-block")}
								value={backgroundImageZIndex}
								onChange={(value) =>
									setAttributes({ backgroundImageZIndex: parseInt(value) })
								}
								min={-10}
								max={10}
							/>
						</>
					)}

					{/* Enable Background Gradient Toggle */}
					<ToggleControl
						label={__("Enable Background Gradient", "hero-block")}
						checked={enableBackgroundGradient}
						onChange={(value) =>
							setAttributes({ enableBackgroundGradient: value })
						}
						style={{ marginTop: "20px" }}
					/>

					{/* Background Gradient Controls */}
					{enableBackgroundGradient && (
						<>
							{/* Gradient Colors Control */}
							<p style={{ marginTop: "20px" }}>
								{__("Gradient Colors", "hero-block")}
							</p>
							{gradientColors.map((color, index) => (
								<div key={index} style={{ marginBottom: "10px" }}>
									<p>{`${__("Color", "hero-block")} ${index + 1}`}</p>
									<ColorPicker
										color={color}
										onChangeComplete={(newColor) => {
											const newGradientColors = [...gradientColors];
											newGradientColors[index] = newColor.hex;
											setAttributes({ gradientColors: newGradientColors });
										}}
									/>
								</div>
							))}

							{/* Gradient Angle Control */}
							<RangeControl
								label={__("Gradient Angle", "hero-block")}
								value={gradientAngle}
								onChange={(value) => setAttributes({ gradientAngle: value })}
								min={0}
								max={360}
							/>

							{/* Gradient Z-Index Control */}
							<NumberControl
								label={__("Gradient Z-Index", "hero-block")}
								value={gradientZIndex}
								onChange={(value) =>
									setAttributes({ gradientZIndex: parseInt(value) })
								}
								min={-10}
								max={10}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
			<style>{allStyles}</style>
			<div {...innerBlocksProps} />
		</>
	);
}

export function save({ attributes }) {
	const {
		uniqueClass,
		enableBackgroundImage,
		enableBackgroundGradient,
		layout,
		columns,
		columnsLaptop,
		columnsTablet,
		columnsMobile,
		placeContent,
		// ...other attributes
	} = attributes;

	const className = `${uniqueClass} hero-block ${
		enableBackgroundImage ? "has-background-image" : ""
	} ${enableBackgroundGradient ? "has-background-gradient" : ""}`;

	// Build styles
	const baseStyles = `
	  .${uniqueClass} {
		display: ${layout};
		${
			layout === "grid"
				? `grid-template-columns: repeat(${columns || 1}, 1fr);`
				: ""
		}
		${layout === "grid" ? `grid-auto-rows: 1fr;` : ""}
		${layout === "grid" && placeContent ? `place-content: ${placeContent};` : ""}
	  }
	  .${uniqueClass} .hero-block {
		height: auto;
	  }
	`;

	const laptopStyles = columnsLaptop
		? `
		@media (min-width: 1025px) and (max-width: 1440px) {
		  .${uniqueClass} {
			grid-template-columns: repeat(${columnsLaptop}, 1fr) !important;
		  }
		}
	  `
		: "";

	const tabletStyles = columnsTablet
		? `
		@media (max-width: 1024px) and (min-width: 768px) {
		  .${uniqueClass} {
			grid-template-columns: repeat(${columnsTablet}, 1fr) !important;
		  }
		}
	  `
		: "";

	const mobileStyles = columnsMobile
		? `
		@media (max-width: 767px) {
		  .${uniqueClass} {
			grid-template-columns: repeat(${columnsMobile}, 1fr) !important;
		  }
		}
	  `
		: "";

	const allStyles = baseStyles + laptopStyles + tabletStyles + mobileStyles;

	const blockProps = useBlockProps.save({
		className,
	});

	return (
		<>
			<style>{allStyles}</style>
			<InnerBlocks.Content />
		</>
	);
}
