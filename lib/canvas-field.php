<?php 

class Canvas_Field extends CMB_Field {

  public function html() { 
  ?>
    <div ng-app="app">
      <palette-canvas></palette-canvas>
      <input ng-model="json" <?php $this->id_attr(); ?> <?php $this->boolean_attr(); ?> type="text" <?php $this->class_attr(); ?> <?php $this->name_attr(); ?> ng-init="json = '<?php echo esc_attr( $this->get_value() ); ?>'" />
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
      array('angular'),
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