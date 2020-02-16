package domain

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

//gorm-テーブル
type User struct {
	gorm.Model
	Username string
	Password string
	Roll     string
}

type Problem struct {
	gorm.Model
	Title         string
	Prob_sentence string
	Author_id     uint
	Category      string
	Status        string
}

type Answers struct {
	gorm.Model
	prob_id      uint
	author_id    uint
	ans_sentence string
}
