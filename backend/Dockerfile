FROM php:8.4-fpm

RUN apt-get update && \
    apt-get install -y git unzip libpq-dev libzip-dev nginx libfreetype6-dev libjpeg62-turbo-dev libpng-dev libwebp-dev && \
    docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp && \
    docker-php-ext-install pdo pdo_pgsql pgsql zip gd opcache && \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www/html

# Copy app code with correct ownership
COPY --chown=www-data:www-data . .

# Install dependencies after copying code to final location
RUN composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader && \
    chown -R www-data:www-data vendor/

COPY docker /docker
COPY docker/uploads.ini /usr/local/etc/php/conf.d/
RUN chmod +x /docker/*.sh
COPY nginx.conf /etc/nginx/sites-available/default

# Ensure Laravel writable dirs exist and are owned by www-data
RUN mkdir -p /var/www/html/bootstrap/cache && \
    mkdir -p /var/www/html/storage/app/public && \
    mkdir -p /var/www/html/storage/framework/cache && \
    mkdir -p /var/www/html/storage/framework/sessions && \
    mkdir -p /var/www/html/storage/framework/views && \
    mkdir -p /var/www/html/storage/logs && \
    chown -R www-data:www-data /var/www/html/storage && \
    chown -R www-data:www-data /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache && \
    chown -R www-data:www-data /var/log/nginx /var/lib/nginx

EXPOSE 8080

ENTRYPOINT ["/docker/init.sh"]
CMD ["/docker/start.sh"]
