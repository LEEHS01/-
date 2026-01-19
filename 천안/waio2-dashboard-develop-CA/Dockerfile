# production stage
FROM nginx:stable-alpine as production-stage
# COPY --from=build-stage /home/app/dist /usr/share/nginx/html
# COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 38080
ENTRYPOINT ["nginx", "-g", "daemon off;"]