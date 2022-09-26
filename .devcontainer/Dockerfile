FROM gitpod/workspace-node

USER root

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        ruby-full

USER gitpod

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
ARG NODE_MODULES=""
RUN umask 0002 \
    && npm cache clean --force > /dev/null 2>&1 \
    && npm install -g npm@latest ${NODE_MODULES} \
    && npm cache clean --force > /dev/null 2>&1
# RUN su node -c "npm install -g <your-package-list -here>"

# Setup gitconfig to be installed from dotfiles
RUN find /home/gitpod/.gitconfig -delete
ADD .gitconfig.local /home/gitpod/.gitconfig.local
