package libary

//判断一个字符串是否在数组中
func InSlice(val interface{}, slice []string) bool {
	for _, v := range slice {
		if v == val {
			return true
		}
	}
	return false
}
