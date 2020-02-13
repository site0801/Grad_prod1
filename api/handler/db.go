package handler

import (
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

//gorm-テーブル
type User struct {
	id       uint `gorm:"primary_key"`
	Username string
	Password string
	Roll     string
}
type Problem struct {
	prob_id       uint `gorm:"primary_key"`
	title         string
	prob_sentence string
	author_id     uint
	category      string
}
type Answers struct {
	prob_id      uint `gorm:"primary_key"`
	author_id    uint
	ans_sentence string
}

func ConnectGorm() *gorm.DB {
	DBMS := "mysql"
	DBUser := "go"
	DBPass := "gurupen"
	DBProtocol := ""
	DBName := "gurupen"
	DBOption := "charset=utf8&parseTime=True&loc=Local"

	Connect := DBUser + ":" + DBPass + "@" + DBProtocol + "/" + DBName + "?" + DBOption
	db, err := gorm.Open(DBMS, Connect)
	if err != nil {
		fmt.Println(err.Error())
	}
	return db
}
