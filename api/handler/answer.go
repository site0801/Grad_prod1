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
type InputAnswer struct {
	ProblemTitle       string `json:"ans_title"`
	ProblemDescription string `json:"prob_sentence"`
	ProblemSolver      string `json:"solver_name"`
	//ProblemStatus      string `json:"status"`
}

func AddAnswer(c echo.Context) error {
	//var problem domain.Problem
	//フロントからjsonを受け取って処理
	param := new(InputAnswer)
	if err := c.Bind(param); err != nil {
		print(param.ProblemTitle)
		return err
	}

	var db = ConnectGorm()
	db.LogMode(true)
	defer db.Close()

	var addanswer = domain.Answers{Prob_Title: param.ProblemTitle, Prob_sentence: param.ProblemDescription, Solver_name: param.ProblemSolver, Status: "Open"}
	fmt.Println("ProblemSolver:" + param.ProblemSolver)

	db.NewRecord(addanswer)
	db.Create(&addanswer)
	db.NewRecord(addanswer)

	return c.JSON(http.StatusOK, map[string]string{})
}

func GetAnswer(c echo.Context) error {
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
	var answers []domain.Answers
	db.Where("Status = ?", "Open").Find(&answers)
	fmt.Println(answers)

	return c.JSON(http.StatusOK, answers)
}
