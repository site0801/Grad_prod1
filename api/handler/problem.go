package handler

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"

	"test/domain"
)

//フロントから持ってくるデータ
type InputProblem struct {
	ProblemTitle       string `json:"title"`
	ProblemDescription string `json:"prob_sentence"`
	ProblemAuthor      string `json:"author_name"`
	ProblemCategory    string `json:"category"`
	//ProblemStatus      string `json:"status"`
}

func AddProblem(c echo.Context) error {
	//var problem domain.Problem
	//フロントからjsonを受け取って処理
	param := new(InputProblem)
	if err := c.Bind(param); err != nil {
		print(param.ProblemTitle)
		return err
	}

	var db = ConnectGorm()
	db.LogMode(true)
	defer db.Close()

	////UsernameのDB取得
	//var response = db.Where("name = ?", param.Username).First(&user)
	//fmt.Println(response)
	//if response != nil {
	//	return echo.NewHTTPError(http.StatusUnauthorized, "The credentials entered are invalid.")
	//}

	var addproblem = domain.Problem{Title: param.ProblemTitle, Prob_sentence: param.ProblemDescription, Author_name: param.ProblemAuthor, Category: param.ProblemCategory, Status: "Open"}
	fmt.Println("ProblemAuthor:" + param.ProblemAuthor)
	if param.ProblemAuthor != "" {
		db.NewRecord(addproblem)
		db.Create(&addproblem)
		db.NewRecord(addproblem)
	}

	return c.JSON(http.StatusOK, map[string]string{})
}

func GetProblem(c echo.Context) error {
	//フロントからjsonを受け取って処理
	param := new(InputUser)
	if err := c.Bind(param); err != nil {
		print(param.Username)
		return err
	}

	var db = ConnectGorm()
	db.LogMode(true)
	defer db.Close()

	////UsernameのDB取得
	var problems []domain.Problem
	db.Where("Status = ?", "Open").Find(&problems)
	fmt.Println(problems)

	return c.JSON(http.StatusOK, problems)
}
