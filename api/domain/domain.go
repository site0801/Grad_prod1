package domain

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

//gorm-テーブル
type User struct {
	gorm.Model
	id       uint `gorm:"primary_key"`
	Username string
	Password string
	Roll     string
}

type Problem struct {
	gorm.Model
	prob_id       uint `gorm:"primary_key"`
	title         string
	prob_sentence string
	author_id     uint
	category      string
}

type Answers struct {
	gorm.Model
	prob_id      uint `gorm:"primary_key"`
	author_id    uint
	ans_sentence string
}
