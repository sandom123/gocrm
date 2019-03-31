package controllers

import (
	"strings"
	"gocrm/models"
	"gocrm/libary"
	"strconv"
	"encoding/json"
	"github.com/astaxie/beego/utils/captcha"
	"github.com/astaxie/beego/cache"
	_"fmt"
	"github.com/astaxie/beego"
)

type SystemController struct{
	BaseController
}

var (
	cpt *captcha.Captcha
	IsShowcaptcha bool
)
func init() {

	//验证码初始化
	store := cache.NewMemoryCache()
	cpt = captcha.NewWithFilter("/captcha/", store)
	cpt.StdWidth = 100
	cpt.StdHeight = 30
	cpt.ChallengeNums = 4

	IsShowcaptcha,_ = beego.AppConfig.Bool("IsShowcaptcha")

}
/**
	登录
 */
func (this *SystemController) Login(){
	if this.isPost(){
		username := strings.TrimSpace(this.GetString("userName"))
		password := strings.TrimSpace(this.GetString("passWord"))
		captcha := strings.TrimSpace(this.GetString("captcha"))
		captcha_id := strings.TrimSpace(this.GetString("captcha_id"))
		if username == "" || password == ""{
			this.jsonOutput(0, "账号或密码不能为空", "")
		}

		//验证码验证
		if IsShowcaptcha && cpt.Verify(captcha_id, captcha) == false{
			this.jsonOutput(0, "验证码错误", "")
		}

		user, err:=models.UserInfoGetByName(username)
		if err != nil{
			this.jsonOutput(0, err, "")
		}
		if libary.Md5(password) != user.Password{
			this.jsonOutput(0, "账号或者密码错误","")
		}else if user.Status == 0{
			this.jsonOutput(0, "账号已关闭，请联系管理员", "")
		}
		this.generateLoginCookie(*user)
		this.jsonOutput(1, "登录成功", "")
		this.StopRun()

	}else{
		//fmt.Println(cpt.CreateCaptchaHTML())
		//this.Data["create_captcha"] = cpt
		this.Data["IsShowcaptcha"] = IsShowcaptcha
		this.Data["title"] = "百合婚礼CRM系统"
		this.TplName = "system/login.html"
	}
}

//生成登录cookie
func (this *SystemController) generateLoginCookie(user models.User)  {
	cookieData := make(map[string]interface{})
	cookieData["id"] = user.Id
	cookieData["account"] = user.Account
	cookieData["role_id"] = user.Role_id
	cookieData["org_id"] = user.Org_id
	cookieData["token"] = libary.CreateUserPassword(strconv.Itoa(user.Id))
	byteJson, _ :=json.Marshal(cookieData)

	this.Ctx.SetCookie(this.AuthCookieName, string(byteJson), 7 * 86400)
}
