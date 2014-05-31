<?php 

$context = Timber::get_context();
$context['posts'] = Timber::get_posts();
if (is_single()) {
  Timber::render('single.twig', $context);
}
else {
  Timber::render('base.twig', $context);
}

 ?>