<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-jasa".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-jasa'),

    'flavors' => array (
  'landing-jasa' => 
  array (
    'label' => 'BERESIN — Jasa',
    'brand_name' => 'BERESIN',
    'brand_tagline' => 'Jasa beres, tanpa ribet',
    'brand_initials' => 'BR',
    'accent' => '#92400e',
    'category' => 'jasa',
    'home' => 'landings.jasa',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/jasa',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
