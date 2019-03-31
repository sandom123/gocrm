package models

import (
	"github.com/astaxie/beego"
	"net/url"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func Init()  {
	dbHost := beego.AppConfig.String("mysql_host")
	dbPort := beego.AppConfig.String("mysql_dbport")
	dbPassword := beego.AppConfig.String("mysql_password")
	dbUser := beego.AppConfig.String("mysql_user")
	dbCharset :=beego.AppConfig.String("mysql_charset")
	timeZone := beego.AppConfig.String("mysql_timezone")
	dbName := beego.AppConfig.String("mysql_dbname")

	if dbPort == ""{
		dbPort = "3306"
	}
	dsn := dbUser + ":" + dbPassword + "@tcp(" + dbHost + ":" + dbPort + ")/" + dbName + "?charset="+dbCharset
	if timeZone != "" {
		dsn = dsn + "&loc=" + url.QueryEscape(timeZone)
	}

	orm.RegisterDriver("mysql", orm.DRMySQL)
	orm.RegisterDataBase("default", "mysql", dsn)

	if beego.AppConfig.String("runmode") == "dev" {
		orm.Debug = true
	}
}

func GetTableName(name string) string {
	return beego.AppConfig.String("mysql_db_prefix") + name
}
