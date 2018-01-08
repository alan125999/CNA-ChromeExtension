//make sure this is the page of a student
var matchURL = /https:\/\/www\.dorm\.ccu\.edu\.tw\/admini\/users\/\d{9}/;
var currentURL = window.location.href;

function getLength(str) {
  if (str == null) return 0;
  if (typeof str != "string") str += "";
  return str.replace(/[^\x00-\xff]/g,"01").length;
}

function insertAfter(newElement, targetElement) {
  /*
  编写逻辑
  1、首先找到给出我们需要插入的元素和用来定位的目标元素
  2、根据目标元素找到两个元素的父元素
  3、判断目标元素是不是父元素内的唯一的元素.
  4、如果是,向父元素执行追加操作,就是appendChild(newElement)
  5、如果不是,向目标元素的之后的紧接着的节点之前执行inserBefore()操作
  */
  var parentElement = targetElement.parentNode; //find parent element
  if (parentElement.lastChild == targetElement)//To determime确定,下决心 whether the last element of the parent element is the same as the target element
  {
    parentElement.appendChild(newElement);
  }
  else {
    parentElement.insertBefore(newElement, targetElement.nextSibling);
  }
}

if (matchURL.test(currentURL)) {
  //利用get設定預設值並，無值即取得預設值，有值則使用之前儲存的值
  chrome.storage.local.get({'enableCopy': true}, function(items) {
    if (items.enableCopy) {
      var Applied = !(document.getElementsByTagName("table")[1] == null)
      //fetch content
      var title = document.getElementsByTagName("h3")[0].textContent;
      var semester = document.getElementsByTagName("h3")[1].textContent;
      var table = [];
      for(var i=0; i<((Applied)? 14:6); i++) table[i] = document.getElementsByTagName("td")[i].textContent;
      var macNumber = document.getElementsByTagName("td")[5].children.length / 2;
      table[5] = [];
      for(var i=0; i<macNumber; i++) table[5].push(document.getElementsByTagName("td")[5].children[i*2].textContent);
      for(var i=macNumber; i<3; i++) table[5].push("　　　　　　　");
      //build new table
      var titleLine = title;
      var line = [
        "學號      ",
        "姓名      ",
        "E-mail    ",
        "系所      ",
        "異常狀態  ",
        "Mac       ",
        "          ",
        "          "
      ]
        //"Keystone", "Switch", "IP", "繳費狀態", "申請時間", "繳費時間", "退費時間", "經手人"];
      for(var i=0; i<5; i++) line[i] += table[i];
      for(var i=0; i<3; i++) line[i+5] += table[5][i];

      if(Applied){
        var titleLen = getLength(titleLine);
        var maxLength = (24>titleLen)? 24:titleLen;
        for(var i = 0; i<8; i++) {
          var length = getLength(line[i]);
          if(length>maxLength) maxLength = length;
        }
        maxLength += 2;
        //Warning不能超過 78 - 33

        //add space
        for(var i=0; i<8; i++) for(var j=getLength(line[i]); j<maxLength;j++) line[i] += " ";
        line[0] += "Keystone   ";
        line[1] += "Switch     ";
        line[2] += "IP         ";
        line[3] += "繳費狀態   ";
        line[4] += "申請時間   ";
        line[5] += "繳費時間   ";
        line[6] += "退費時間   ";
        line[7] += "經手人     ";
        for(var i=0; i<8; i++) line[i] += table[i+6];
        for(var j=titleLen; j<maxLength;j++) titleLine += " ";
        titleLine += semester;
      }

      //connect string
      var result = titleLine + '\n';
      for(var i=0; i<8; i++) result += line[i]+"\n";
      console.log(result);

      //create new button
      copyBtn = document.createElement('div');
      copyBtn.className = "btn btn-info";
      copyBtn.innerText = "複製資料";
      copyBtn.style.marginLeft = "4px"
      copyBtn.onclick = function(){
        var clip_area = document.createElement('textarea');
        clip_area.textContent = result;
        document.body.appendChild(clip_area);
        clip_area.select();
        document.execCommand('copy');
        clip_area.remove();
        copyBtn.innerText = "已複製至剪貼簿";
        copyBtn.className = "btn btn-default";
        setTimeout(function(){
          copyBtn.innerText = "複製資料";
          copyBtn.className = "btn btn-info";
        }, 1500)
      };
      //find the first button
      target = document.getElementsByClassName("btn btn-danger")[0];
      //add button to body
      insertAfter(copyBtn,target);
    };
  });
};

/*var id = {
  "id"          : 0,
  "username"    : 1,
  "email"       : 2,
  "department"  : 3,
  "suspend"     : 4,
  "mac"         : 5,
  "keystone"    : 6,
  "swtich"      : 7,
  "ip"          : 8,
  "paid"        : 9,
  "applyTime"   : 10,
  "paidTime"    : 11,
  "refundTime"  : 12,
  "handler"     : 13,
}*/
