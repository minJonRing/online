
function PostAA(URL, PARAMTERS) {
    //创建form表单
    var temp_form = document.createElement("form");
    temp_form.action = URL;
    //如需打开新窗口，form的target属性要设置为'_blank'
    // temp_form.target = "_blank";
    temp_form.method = "get";
    temp_form.style.display = "none";
    for (var i = 0; i < PARAMTERS.length; i++) {
        var opt = document.createElement("input");
        opt.name = PARAMTERS[i].name;
        opt.value = PARAMTERS[i].value;
        temp_form.appendChild(opt);
    }
    document.body.appendChild(temp_form);
    //提交数据
    temp_form.submit();
}