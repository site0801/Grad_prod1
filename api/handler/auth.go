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

type jwtCustomClaims struct {
	UserID uint   `json:"userid"`
	Name   string `json:"name"`
	Admin  bool   `json:"admin"`
	jwt.StandardClaims
}

func SignUp(c echo.Context) error {
	var user domain.User
	//フロントからjsonを受け取って処理
	param := new(InputUser)
	if err := c.Bind(param); err != nil {
		print(param.Username)
		return err
	}

	var db = ConnectGorm()
	db.LogMode(true)
	defer db.Close()

	////デバッグ用
	//print("username:" + param.Username);
	//print("password:" + param.Password);

	////UsernameのDB取得
	var response = db.Where("name = ?", param.Username).First(&user)
	fmt.Println(response)
	//if response != nil {
	//	return echo.NewHTTPError(http.StatusUnauthorized, "The credentials entered are invalid.")
	//}

	var signup = domain.User{Username: param.Username, Password: param.Password, Roll: "student"}
	db.NewRecord(signup)
	db.Create(&signup)
	db.NewRecord(signup)

	return c.JSON(http.StatusOK, map[string]string{})
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

	db.Where("Username = ?", param.Username).First(&user)
	fmt.Println(user.ID)
	var userid uint = user.ID
	// Throws unauthorized error
	if param.Username != user.Username || param.Password != user.Password {
		return echo.ErrUnauthorized
	}

	// Set claims
	claims := &jwtCustomClaims{
		userid,
		user.Username,
		true,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 72).Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"token": t,
	})
}
