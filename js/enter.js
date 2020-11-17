let showhelp = document.getElementById("showhelp");
        showhelp.onclick = () => {
            document.getElementById('hide1').style.display = 'block';
            document.getElementById('help').style.display = 'block';
        }
        let showabout = document.getElementById("showabout");
        showabout.onclick = () => {
            document.getElementById('hide1').style.display = 'block';
            document.getElementById('about').style.display = 'block';
        }
        let goback = document.getElementById("goback");
        goback.onclick = () => {
            document.getElementById('hide1').style.display = 'none';
            document.getElementById('help').style.display = 'none';
        }
        let goback2 = document.getElementById("goback2");
        goback2.onclick = () => {
            document.getElementById('hide1').style.display = 'none';
            document.getElementById('about').style.display = 'none';
        }