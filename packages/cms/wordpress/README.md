# CMS/Wordpress - @kit/wordpress

Implementation of the CMS layer using the [Wordpress](https://wordpress.org) library. [WIP - not yet working]

This implementation is used when the host app's environment variable is set as:

```
CMS_CLIENT=wordpress
```

Additionally, please set the following environment variables:

```
WORDPRESS_API_URL=http://localhost:8080
```

For development purposes, we ship a Docker container that runs a Wordpress instance. To start the container, run:

```
docker-compose up
```

or

```
pnpm run start
```

from this package's root directory.

The credentials for the Wordpress instance are:

```
WORDPRESS_DB_HOST=db
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress
WORDPRESS_DB_NAME=wordpress
```

You will be asked to set up the Wordpress instance when you visit `http://localhost:8080` for the first time.

## Note for Wordpress REST API

To make the REST API in your Wordpress instance work, please change the permalink structure to `/%post%/` from the Wordpress admin panel.

## Blog

To include Blog Posts from Wordpress - please create a **post** with category named `blog` and add posts to it.

## Documentation

To include Documentation from Wordpress - please create a **page** with category named `documentation` and add posts to it.

This involves enabling categories for pages. To do this, add the following code to your theme's `functions.php` file:

```php
function add_categories_to_pages() {
    register_taxonomy_for_object_type('category', 'page');
}
add_action('init', 'add_categories_to_pages');
```

Please refer to `wp-content/themes/twentytwentyfour/functions.php` for an example of a theme that includes this code.