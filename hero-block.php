<?php
// hero-block.php

/**
 * Plugin Name:       Hero Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hero-block
 *
 * @package CreateBlock
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

// Include the render function
require_once __DIR__ . '/build/render.php';

/**
 * Registers the block using the metadata loaded from the `block.json` file,
 * explicitly setting the render callback.
 */
function create_hero_block_init()
{
	register_block_type_from_metadata(
		__DIR__ . '/build',
		[
			'render_callback' => 'render_hero_block',
		]
	);
}
add_action('init', 'create_hero_block_init');


function enqueue_extend_button_script()
{
	wp_enqueue_script(
		'extend-button-script',
		plugins_url('extend-button.js', __FILE__),
		array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-hooks', 'wp-compose'),
		filemtime(plugin_dir_path(__FILE__) . 'extend-button.js')
	);
}
add_action('enqueue_block_editor_assets', 'enqueue_extend_button_script');


function enqueue_extend_text_blocks_script()
{
	wp_enqueue_script(
		'extend-text-blocks-script',
		plugins_url('extend-text-blocks.js', __FILE__),
		array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-hooks', 'wp-compose'),
		filemtime(plugin_dir_path(__FILE__) . 'extend-text-blocks.js')
	);
}
add_action('enqueue_block_editor_assets', 'enqueue_extend_text_blocks_script');


/**
 * Enqueue animate.js framework for the blocks
 */
function my_custom_plugin_enqueue_styles()
{
	wp_enqueue_style('animate-css', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css', array(), '4.1.1');
}
add_action('enqueue_block_editor_assets', 'my_custom_plugin_enqueue_styles');
add_action('wp_enqueue_scripts', 'my_custom_plugin_enqueue_styles');
