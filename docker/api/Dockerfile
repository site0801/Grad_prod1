FROM golang:1.10.2-alpine3.7

COPY main.go /go/src/qpn/

WORKDIR /go/src/qpn/

RUN apk update \
  && apk add --no-cache git \
  && go get -u github.com/labstack/echo/...

CMD go run main.go