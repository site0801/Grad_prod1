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
    e.Static("/assets", "public/assets")


    e.File("/", "public/index.html")
    e.File("/signup", "public/signup.html")
    e.POST("/signup", handler.Signup)
    e.File("/login", "public/login.html")
    e.POST("/login", handler.Login)


    api := e.Group("/api")
    api.Use(middleware.JWTWithConfig(handler.Config))
    api.GET("/todos", handler.GetTodos)
    api.POST("/todos", handler.AddTodo)
    api.DELETE("/todos/:id", handler.DeleteTodo)
    api.PUT("/todos/:id/completed", handler.UpdateTodo)

    e.GET("/", hello)
    e.Logger.Fatal(e.Start(":1323"))
}
