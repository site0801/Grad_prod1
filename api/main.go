package main

import (
	"net/http"
	"time"
	"fmt"
	//"reflect"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type Response struct {
    Status  int
    Message string
}

type InputUser struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

//DB
type User struct {
	id uint `gorm:"primary_key"`
	Username string
	Password string
	Roll string
}

type Problem struct {
    prob_id uint `gorm:"primary_key"`
    title string
    prob_sentence string
    author_id uint
    category string
}

type Answers struct {
    prob_id uint `gorm:"primary_key"`
    author_id uint
    ans_sentence string
}

const (
    // データベース
    Dialect = "mysql"
    // ユーザー名
    DBUser = "go"
    // パスワード
    DBPass = "gurupen"
    // プロトコル
    DBProtocol = "tcp(127.0.0.1:3306)"
    // DB名
    DBName = "go_sample"
)

func connectGorm() *gorm.DB {
    connectTemplate := "%s:%s@%s/%s"
    connect := fmt.Sprintf(connectTemplate, DBUser, DBPass, DBProtocol, DBName)
    db, err := gorm.Open(Dialect, connect)

    if err != nil {
        log.Println(err.Error())
    }

    return db
}

func login(c echo.Context) error {
	var user User
	//フロントからjsonを受け取って処理
	param := new(InputUser)
	if err := c.Bind(param); err != nil {
		print(param.Username)
        return err
	}
	db, dberr := gorm.Open("mysql", "go:gurupen@/gurupen?charset=utf8&parseTime=True&loc=Local")

	defer db.Close()
	
	////デバッグ用
	//print("username:" + param.Username);
	//print("password:" + param.Password);

	////UsernameのDB取得
	var response = db.Where("name = ?", param.Username).First(&user)
	fmt.Println(response)

	// Throws unauthorized error
	if param.Username != "jon" || param.Password != "shhh" {
		return echo.ErrUnauthorized
	}

	// Create token
	token := jwt.New(jwt.SigningMethodHS256)

	// Set claims
	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = "Jon Snow"
	claims["admin"] = true
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"token": t,
	})
}

func accessible(c echo.Context) error {
	return c.String(http.StatusOK, "Accessible")
}

func restricted(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	name := claims["name"].(string)
	return c.String(http.StatusOK, "Welcome "+name+"!")
}

func bodyDumpHandler(c echo.Context, reqBody, resBody []byte) {
	fmt.Printf("Request Body: %v\n", string(reqBody))
	fmt.Printf("Response Body: %v\n", string(resBody))
}

func main() {
	//Initial
	e := echo.New()
	db, dberr := gorm.Open("mysql", "go:gurupen@/gurupen?charset=utf8&parseTime=True&loc=Local")
    if dberr != nil {
		fmt.Println(dberr)
	}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))
	e.Use(middleware.BodyDump(bodyDumpHandler))

	// Login route
	e.POST("/login", login)

	// Unauthenticated route
	e.GET("/", accessible)

	// Restricted group
	r := e.Group("/restricted")
	r.Use(middleware.JWT([]byte("secret")))
	r.GET("", restricted)

	e.Logger.Fatal(e.Start(":1323"))
}