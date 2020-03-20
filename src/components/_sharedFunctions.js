

export const sizeSideBar = () => {

    var height = window.innerHeight; 
    var width = window.innerWidth; 
    var mainwid = width -1;
    


    if(width > 577 && 0){
      var lHeight = document.getElementById('navWrapper').offsetHeight; 
      var new_height = height - lHeight;
      document.getElementById('belowNav').style.height = new_height + "px";
      document.getElementById('belowNav').style.width = 220 + "px";
      document.getElementById('logoWrap').style.width = 220 + 'px';
      document.getElementById('main').style.marginLeft = 220 + 'px';
      mainwid -= 220;
    } else {
      document.getElementById('logoWrap').style.width = 0 + 'px';
      document.getElementById('belowNav').style.width = 0 + 'px';
      document.getElementById('main').style.marginLeft = 0 + 'px';
    }
    document.getElementById('main').style.width = mainwid + 'px';
    if(document.getElementById('donor_rows')){
      document.getElementById('donor_rows').style.height = (parseInt(height)-125)+'px';
    }
}
  
export function get_date(){
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let d = new Date();
  let month = parseInt(d.getMonth());
  month = months[month];
  month = month[0] + month[1] + month[2]
  month = month.toUpperCase();

  let tdate = month +"" + d.getDate() + "_"+ d.getFullYear() +"_"+d.getHours() + "_" +d.getMinutes()
  return tdate;
}

export function get_date2(){
  let d = new Date();
  let month = parseInt(d.getMonth());
  month += 1;
  let tdate = d.getDate() + "_" + month + "_" + d.getFullYear()  + "_" + d.getHours() + d.getMinutes() + d.getSeconds();
  return tdate;
}

export function get_date3(){
  let d = new Date();
  let month = parseInt(d.getMonth());
  month += 1;
  let tdate = d.getDate() + " " + month + " " + d.getFullYear()  + " " + d.getHours() +":" + d.getMinutes();
  return tdate;
}

export function centerLogin(){
  var height = window.innerHeight; 
  var lHeight = document.getElementById('loginform').offsetHeight; 
  var new_top = (height/2) - lHeight;
  if (new_top < 1) new_top = 10;
  document.getElementById('loginform').style.marginTop = new_top+"px";
}

