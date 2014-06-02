<?php 

class Canvas_Field extends CMB_Field {

  public function html() { 
  ?>
    <div ng-app="app">
      <post-canvas></post-canvas>
    </div>
  <?php
  }



  public function enqueue_scripts() {

    parent::enqueue_scripts();

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
      array('angular', 'jquery'),
      false,
      true
    );
    wp_enqueue_style( 
      'wp-components', 
      get_template_directory_uri() . '/css/wp-components.css'
    );
  }

}

 ?>