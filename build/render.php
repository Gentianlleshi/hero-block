<?php
// render.php

function render_hero_block($attributes, $content)
{
	// Extract attributes with defaults
	$layout = $attributes['layout'] ?? 'block';
	$columns = $attributes['columns'] ?? 1;
	$justifyContent = $attributes['justifyContent'] ?? 'flex-start';
	$alignItems = $attributes['alignItems'] ?? 'stretch';
	$placeContent = $attributes['placeContent'] ?? 'normal';
	$gap = isset($attributes['gap']) ? $attributes['gap'] : 0;
	$gapUnit = isset($attributes['gapUnit']) ? $attributes['gapUnit'] : 'px';
	$flexDirection = $attributes['flexDirection'] ?? 'row';

	// Background attributes
	$backgroundImage = $attributes['backgroundImage'] ?? '';
	$gradientColors = $attributes['gradientColors'] ?? [];
	$gradientAngle = $attributes['gradientAngle'] ?? 0;
	$backgroundImageZIndex = isset($attributes['backgroundImageZIndex']) ? intval($attributes['backgroundImageZIndex']) : -1;
	$gradientZIndex = isset($attributes['gradientZIndex']) ? intval($attributes['gradientZIndex']) : -1;
	$enableBackgroundImage = isset($attributes['enableBackgroundImage']) ? $attributes['enableBackgroundImage'] : false;
	$enableBackgroundGradient = isset($attributes['enableBackgroundGradient']) ? $attributes['enableBackgroundGradient'] : false;
	$backgroundSize = $attributes['backgroundSize'] ?? 'cover';
	$backgroundPosition = $attributes['backgroundPosition'] ?? 'center center';
	$backgroundRepeat = $attributes['backgroundRepeat'] ?? 'no-repeat';
	$uniqueClass = isset($attributes['uniqueClass']) ? $attributes['uniqueClass'] : '';

	// Dimensions and Spacing attributes
	$height = isset($attributes['height']) ? $attributes['height'] : '';
	$minHeight = isset($attributes['minHeight']) ? $attributes['minHeight'] : '';
	$maxHeight = isset($attributes['maxHeight']) ? $attributes['maxHeight'] : '';
	$width = isset($attributes['width']) ? $attributes['width'] : '';
	$minWidth = isset($attributes['minWidth']) ? $attributes['minWidth'] : '';
	$maxWidth = isset($attributes['maxWidth']) ? $attributes['maxWidth'] : '';
	$paddingTop = isset($attributes['paddingTop']) ? $attributes['paddingTop'] : '';
	$paddingRight = isset($attributes['paddingRight']) ? $attributes['paddingRight'] : '';
	$paddingBottom = isset($attributes['paddingBottom']) ? $attributes['paddingBottom'] : '';
	$paddingLeft = isset($attributes['paddingLeft']) ? $attributes['paddingLeft'] : '';
	$marginTop = isset($attributes['marginTop']) ? $attributes['marginTop'] : '';
	$marginRight = isset($attributes['marginRight']) ? $attributes['marginRight'] : '';
	$marginBottom = isset($attributes['marginBottom']) ? $attributes['marginBottom'] : '';
	$marginLeft = isset($attributes['marginLeft']) ? $attributes['marginLeft'] : '';

	$style = "display: {$layout};";

	if ($layout === 'flex') {
		$style .= " justify-content: {$justifyContent}; align-items: {$alignItems}; flex-direction: {$flexDirection};";
	} elseif ($layout === 'grid') {
		$style .= " grid-template-columns: repeat({$columns}, 1fr); place-content: {$placeContent};";
	}

	if ($layout === 'flex' || $layout === 'grid') {
		$style .= " gap: {$gap}{$gapUnit};";
	}

	// Handle dimensions and spacing
	if (!empty($height)) {
		$style .= " height: {$height};";
	}
	if (!empty($minHeight)) {
		$style .= " min-height: {$minHeight};";
	}
	if (!empty($maxHeight)) {
		$style .= " max-height: {$maxHeight};";
	}
	if (!empty($width)) {
		$style .= " width: {$width};";
	}
	if (!empty($minWidth)) {
		$style .= " min-width: {$minWidth};";
	}
	if (!empty($maxWidth)) {
		$style .= " max-width: {$maxWidth};";
	}
	if (!empty($paddingTop)) {
		$style .= " padding-top: {$paddingTop};";
	}
	if (!empty($paddingRight)) {
		$style .= " padding-right: {$paddingRight};";
	}
	if (!empty($paddingBottom)) {
		$style .= " padding-bottom: {$paddingBottom};";
	}
	if (!empty($paddingLeft)) {
		$style .= " padding-left: {$paddingLeft};";
	}
	if (!empty($marginTop)) {
		$style .= " margin-top: {$marginTop};";
	}
	if (!empty($marginRight)) {
		$style .= " margin-right: {$marginRight};";
	}
	if (!empty($marginBottom)) {
		$style .= " margin-bottom: {$marginBottom};";
	}
	if (!empty($marginLeft)) {
		$style .= " margin-left: {$marginLeft};";
	}

	// Handle backgrounds
	$hasBackgroundImage = $enableBackgroundImage;
	$hasBackgroundGradient = $enableBackgroundGradient;

	if ($hasBackgroundImage || $hasBackgroundGradient) {
		$style .= " position: relative;";
	}

	if ($hasBackgroundImage && !empty($backgroundImage)) {
		$style .= "--background-image: url('" . esc_url($backgroundImage) . "');";
		$style .= "--background-image-z-index: {$backgroundImageZIndex};";
		$style .= "--background-size: {$backgroundSize};";
		$style .= "--background-position: {$backgroundPosition};";
		$style .= "--background-repeat: {$backgroundRepeat};";
	}

	if ($hasBackgroundGradient && !empty($gradientColors) && is_array($gradientColors)) {
		$gradient = 'linear-gradient(' . intval($gradientAngle) . 'deg, ' . implode(', ', array_map('esc_attr', $gradientColors)) . ')';
		$style .= "--gradient: {$gradient};";
		$style .= "--gradient-z-index: {$gradientZIndex};";
	}

	// Build class name
	$class_name = 'hero-block ' . esc_attr($uniqueClass);

	if ($hasBackgroundImage) {
		$class_name .= ' has-background-image';
	}

	if ($hasBackgroundGradient) {
		$class_name .= ' has-background-gradient';
	}

	return sprintf(
		'<div class="%1$s" style="%2$s">%3$s</div>',
		esc_attr($class_name),
		esc_attr($style),
		$content
	);
}
