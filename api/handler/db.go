package handler

import (
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"

	"test/domain"
)

func InitGorm() {
	db := ConnectGorm()
	db.AutoMigrate(&domain.User{}, &domain.Problem{}, &domain.Answers{})
}

func ConnectGorm() *gorm.DB {
	DBMS := "mysql"
	DBUser := "go"
	DBPass := "gurupen"
	DBProtocol := "tcp(127.0.0.1:3306)"
	DBName := "gurupen"
	DBOption := "charset=utf8&parseTime=True&loc=Local"

	Connect := DBUser + ":" + DBPass + "@" + DBProtocol + "/" + DBName + "?" + DBOption
	fmt.Println(Connect)
	db, err := gorm.Open(DBMS, Connect)
	if err != nil {
		fmt.Println(err.Error())
	}
	return db
}
