<?php 

require_once('lib/timber/timber.php');
require_once('lib/cmb/custom-meta-boxes.php');
require_once('lib/canvas-field.php');

add_filter( 'cmb_field_types', function( $cmb_field_types ) {
    $cmb_field_types['canvas'] = 'Canvas_Field';
    return $cmb_field_types;
} );

add_filter('cmb_meta_boxes', 'register_meta_boxes');

function register_meta_boxes( array $meta_boxes ) {
  $prefix = '_cmb_'; // Prefix for all fields

  $meta_boxes[] = array(
    'id' => 'post',
    'title' => 'Post Content',
    'pages' => 'post',
    'context'    => 'normal',
    'priority'   => 'high',
    'fields' => array(
      array(
        'name' => 'Canvas',
        'id'   => $prefix . 'component_canvas',
        'type' => 'canvas'
      ),
     )
  );




  return $meta_boxes;

}


add_action('init', 'setup_theme');

function setup_theme(){
  add_theme_support( 'post-thumbnails' );
  remove_post_type_support('post', 'editor');
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