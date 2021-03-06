package controllers

import (
	"github.com/astaxie/beego"
	"strings"
	"gocrm/libary"
	"gocrm/models"
	"strconv"
)

/**
	gocrm 控制器父类
 */
type BaseController struct {
	beego.Controller
	ControllerName string
	ActionName     string
	AuthCookieName string //登录Cookie
	AllowNoLogin []string //是否允许未登录用户访问页面，如果允许不登录，则写在这里
	AllowNoRight []string//是否权限限制，如果不受权限限制，则写在这里
	Version string //系统版本
	AdminId int
	UserInfo *models.User
}

/**
	初始化方法
 */
func (this *BaseController)  Prepare(){
	//页面布局
	this.Layout = "layout/main.html"
	this.Version = "1.0.8"
	this.ControllerName, this.ActionName =this.GetControllerAndAction()
	this.ControllerName = strings.ToLower(this.ControllerName)
	this.ActionName = strings.ToLower(this.ActionName)
	this.AuthCookieName = "myAuthCookie"
	this.Data["version"] = this.Version

	this.AllowNoLogin = []string{"login"}
	this.AllowNoRight = []string{"indexcontroller", "ajaxcontroller"}
	if !libary.InSlice(this.ActionName, this.AllowNoLogin){
		this.checkLogin()

	}
}

/**
	检测登录
 */
func (this *BaseController) checkLogin(){
	AuthCookie := this.Ctx.GetCookie(this.AuthCookieName)
	if AuthCookie == ""{
		this.Ctx.Redirect(302, "/system/login")
	}

	token := AuthCookie[:32]
	userIdStr := AuthCookie[32:]
	uid, err := strconv.Atoi(userIdStr)
	if err != nil{
		this.Ctx.Redirect(302, "/system/login")
	}
	checkToken := libary.CreateUserPassword(userIdStr)
	if token != checkToken{
		this.Ctx.Redirect(302, "/system/login")
	}
	this.AdminId = uid
	this.UserInfo = models.GetUserInfo(uid)
	if this.UserInfo == nil{
		this.Ctx.Redirect(302, "/system/login")
	}
}

//是否为post请求
func (this *BaseController) isPost() bool{
	return this.Ctx.Request.Method == "POST"
}

//是否为get请求
func (this *BaseController) isGet() bool{
	return this.Ctx.Request.Method == "GET"
}

//获取用户ip
func (this *BaseController) getClientIp() string{
	s := strings.Split(this.Ctx.Request.RemoteAddr, ":")

	return s[0]
}

/**
 json输出
 */
func (this *BaseController) jsonOutput(code int, message string,data interface{}){
	out := make(map[string]interface{})
	out["code"] = code
	out["msg"] = message
	out["data"] = data
	this.Data["json"] = out
	this.ServeJSON()
	this.StopRun()
}
