FROM openjdk:22-jdk-bullseye
LABEL authors="cyx"

#RUN apt-get update && \
#    apt-get install -y wget unzip chromium && \
#    rm -rf /var/lib/apt/lists/*
##RUN sed -i 's|http://deb.debian.org/debian|https://mirrors.tuna.tsinghua.edu.cn/debian|g' /etc/apt/sources.list && \
##    sed -i 's|http://security.debian.org|https://mirrors.tuna.tsinghua.edu.cn/debian-security|g' /etc/apt/sources.list && \
##    apt-get update && \
##    apt-get install -y chromium-driver chromium && \
##    rm -rf /var/lib/apt/lists/*
#RUN CHROMIUM_VERSION=$(chromium --version | grep -oP '\d+\.\d+\.\d+') && \
#    CHROMIUM_MAJOR_VERSION=$(echo $CHROMIUM_VERSION | cut -d. -f1) && \
#    CHROMEDRIVER_VERSION=$(wget -qO- https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROMIUM_MAJOR_VERSION) && \
#    wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip && \
#    unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
#    rm /tmp/chromedriver.zip && \
#    chmod +x /usr/local/bin/chromedriver
#
#ENV CHROME_BIN=/usr/bin/chromium
#ENV CHROME_DRIVER_PATH=/usr/local/bin/chromedriver

#RUN apt-get update && \
#    apt-get install -y fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc-s1 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release xdg-utils && \
#    rm -rf /var/lib/apt/lists/*

ADD target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]