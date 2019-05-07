package services

import (
	"gocrm/models"
	"fmt"
)

/**
 	获取左侧菜单列表
 */
func GetMenuList() []*models.Menu{
	where := fmt.Sprintf("ismenu = %d AND status = %d", 1, 1)
	menuList := models.GetMenuList(where, "-weigh", 1, 1)

	return menuList
}

func HookMenus(roleIds string)  {
	//menuList := GetMenuList()
	//rights:= ""
	if roleIds != ""{
		where := fmt.Sprintf("role_id in(%s)", roleIds)
		roleList :=models.GetRoleListByWhere(where)
		fmt.Println(roleList)
	}
}