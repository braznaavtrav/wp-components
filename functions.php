<?php 

require_once('lib/timber/timber.php');

add_action( 'init', 'setup_theme' );
function setup_theme(){
  add_theme_support( 'post-thumbnails' );
}

add_action( 'wp_enqueue_scripts', 'my_scripts_method' );
function my_scripts_method() {
	wp_enqueue_script(
		'angular',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.min.js',
		false,
		false,
		true
	);
	wp_enqueue_script(
		'app',
		get_stylesheet_directory_uri() . '/js/app.js',
		array('angular'),
		false,
		true
	);
}

?>