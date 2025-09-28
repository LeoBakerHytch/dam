FROM php:8.4-fpm

RUN apt-get update && \
    apt-get install -y git unzip libpq-dev libzip-dev nginx libfreetype6-dev libjpeg62-turbo-dev libpng-dev libwebp-dev && \
    docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp && \
    docker-php-ext-install pdo pdo_pgsql pgsql zip gd opcache && \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .
RUN composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader

RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache.ini

RUN groupadd -g 1000 www && \
    useradd -u 1000 -ms /bin/bash -g www www

COPY docker /docker
COPY docker/uploads.ini /usr/local/etc/php/conf.d/
RUN chmod +x /docker/*.sh

WORKDIR /var/www/html
COPY --chown=www:www . .
COPY nginx.conf /etc/nginx/sites-available/default

RUN chown -R www:www /var/www/html && \
    chmod -R 755 /var/www/html && \
    chmod -R 775 storage bootstrap/cache && \
    chown -R www:www /var/log/nginx /var/lib/nginx

EXPOSE 8080

ENTRYPOINT ["/docker/init.sh"]
CMD ["/docker/start.sh"]
