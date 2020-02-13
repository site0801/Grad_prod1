package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"

	"test/domain"
)

//フロントから持ってくるデータ
type InputUser struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c echo.Context) error {
	var user domain.User
	//フロントからjsonを受け取って処理
	param := new(InputUser)
	if err := c.Bind(param); err != nil {
		print(param.Username)
		return err
	}

	var db = ConnectGorm()
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
