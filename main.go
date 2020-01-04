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

    // public 
    e.File("/", "public/index.html")
    e.File("/signup", "public/signup.html")
    e.POST("/signup", handler.Signup)
    e.File("/login", "public/login.html")
    e.POST("/login", handler.Login)

    // private()
    api := e.Group("/api")
    api.Use(middleware.JWTWithConfig(handler.Config))
    api.GET("/problems", handler.GetProblems)
    api.POST("/problems", handler.AddProbxlems)
    api.GET("/problems/:id", handler.GetProblemHome)
    api.GET("/problems/:id/statement", handler.GetProblemStatement)
    api.GET("/problems/:id/submit", handler.GetProblemSubmit)
    api.POST("/problems/:id/submit", handler.AddProblemSubmit)
    api.GET("/problems/:id/question", handler.GetProblemQuestion)
    api.POST("/problems/:id/question", handler.AddProblemQuestion)

    e.Logger.Fatal(e.Start(":1323"))
}
