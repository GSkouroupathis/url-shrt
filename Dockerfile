FROM		ubuntu

# Prepare Environment
RUN			apt-get -y update && apt-get -y upgrade
RUN			apt-get -y install supervisor && \
				apt-get -y install nodejs && \
				apt-get -y install npm && \
				ln -s /usr/bin/nodejs /usr/bin/node
COPY		supervisord.conf /etc/supervisor/supervisord.conf
RUN			mkdir -p /var/log/supervisord/ && \
				touch /var/log/supervisord/supervisord.log

# Copy program files
COPY		public /opt/url-shrt/public
COPY		views /opt/url-shrt/views
COPY		cleanup.js /opt/url-shrt/cleanup.js
COPY		config.js /opt/url-shrt/config.js
COPY		main.js	/opt/url-shrt/index.js
COPY		package.json /opt/url-shrt/package.json
COPY		utils.js /opt/url-shrt/utils.js

RUN			cd /opt/url-shrt && \
				npm install

# Expose port
EXPOSE	3020

# Run program
CMD			["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
