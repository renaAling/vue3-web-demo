FROM nginx

COPY ./dist-pro /data

RUN rm /etc/nginx/conf.d/default.conf

ADD ./rls-ui.conf /etc/nginx/conf.d/default.conf

RUN /bin/bash -c 'echo init ok'
