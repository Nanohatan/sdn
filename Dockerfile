FROM centos:7

# Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
RUN yum install -y epel-release
# Install Node.js and npm
RUN yum install -y nodejs npm

# Install app dependencies
COPY package.json /src/package.json
RUN cd src; npm install express

# Bundle app source
COPY . /src

EXPOSE 8080


RUN yum -y localinstall --nogpgcheck https://download1.rpmfusion.org/free/el/rpmfusion-free-release-7.noarch.rpm
RUN yum -y install ffmpeg ffmpeg-devel

#CMD ["nohup","node", "/src/index.js"]
