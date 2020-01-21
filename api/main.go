package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/contrib/sessions"
	//"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

const (
	userkey = "user"
)

func main() {
	r := router()
	r.Use(gin.Logger())
	if err := router().Run(":8080"); err != nil {
		log.Fatal("Unable to start:", err)
	}
}

func router() *gin.Engine {
	r := gin.New()

	// CORS 対応
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://sample.com"}
	r.Use(cors.New(config))
	
	// public
	r.Use(sessions.Sessions("mysession", sessions.NewCookieStore([]byte("secret"))))
	r.POST("/login", login)
	r.GET("/logout", logout)
	/*
		r.GET("/ping", handler.pong)
		r.Static("/", "public/index.html")
		r.Static("/signup", "public/signup.html")
		r.POST("/signup", handler.Signup)
		r.Static("/login", "public/login.html")
		r.POST("/login", handler.Login)
	*/

	private := r.Group("/private")
	private.Use(AuthRequired)
	{
		private.GET("/me", me)
		private.GET("/status", status)
		/*
			private.GET("/problems", handler.GetProblems)
			private.POST("/problems", handler.AddProbxlems)
			private.GET("/problems/:id", handler.GetProblemHome)
			private.GET("/problems/:id/statement", handler.GetProblemStatement)
			private.GET("/problems/:id/submit", handler.GetProblemSubmit)
			private.POST("/problems/:id/submit", handler.AddProblemSubmit)
			private.GET("/problems/:id/question", handler.GetProblemQuestion)
			private.POST("/problems/:id/question", handler.AddProblemQuestion)
		*/
	}
	return r
}

// AuthRequired is a simple middleware to check the session
func AuthRequired(c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get(userkey)
	if user == nil {
		// Abort the request with the appropriate error code
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	// Continue down the chain to handler etc
	c.Next()
}

// login is a handler that parses a form and checks for specific data
func login(c *gin.Context) {
	session := sessions.Default(c)
	username := c.PostForm("username")
	password := c.PostForm("password")

	// Validate form input
	if strings.Trim(username, " ") == "" || strings.Trim(password, " ") == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameters can't be empty"})
		return
	}

	// Check for username and password match, usually from a database
	if username != "hello" || password != "itsme" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication failed"})
		return
	}

	// Save the username in the session
	session.Set(userkey, username) // In real world usage you'd set this to the users ID
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully authenticated user"})
}

func logout(c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get(userkey)
	if user == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session token"})
		return
	}
	session.Delete(userkey)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}

func me(c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get(userkey)
	c.JSON(http.StatusOK, gin.H{"user": user})
}

func status(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "You are logged in"})
}
