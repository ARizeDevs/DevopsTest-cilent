From node:17.0.23 As build
WORKDIR /build

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci 

COPY public/ public
COPY src/ src
RUN npm run build
