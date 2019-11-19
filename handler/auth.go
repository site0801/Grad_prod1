package handler

import (
	"github.com/labstack/echo/middleware"
    "github.com/labstack/echo"
)

func BasicAuth() echo.MiddlewareFunc  {
    return middleware.BasicAuth(func(username string, password string, context echo.Context) (bool, error) {
        if username == "joe" && password == "correct" {
            return true,nil
        }
        return false,nil
    })
}