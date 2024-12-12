#!/bin/bash

NGINX_CONF="/etc/nginx/sites-available/LabSite.conf"

# Detect the PHP-FPM version
PHP_FPM_VERSION=$(ls /var/run/php/ | grep -oP 'php[0-9.]+-fpm.sock' | sort -r | head -n 1)

# Update the Nginx configuration
sudo sed -i "s#fastcgi_pass unix:/var/run/php/.*-fpm.sock;#fastcgi_pass unix:/var/run/php/$PHP_FPM_VERSION;#g" $NGINX_CONF

# Restart Nginx to apply changes
sudo systemctl restart nginx
