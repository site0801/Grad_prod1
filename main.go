package main

import (
    "api/handler"
    
    "net/http"
    "github.com/labstack/echo"
    "github.com/labstack/echo/middleware"
)

func hello(c echo.Context) error {
    return c.JSON(http.StatusOK, map[string]string{"hello": "World"})
}

func main() {
    e := echo.New()

    // Middleware
	e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    e.Use(handler.BasicAuth())

    e.GET("/", hello)
    e.Logger.Fatal(e.Start(":1323"))
}
