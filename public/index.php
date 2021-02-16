<?php
error_reporting(2);
session_start(['cookie_lifetime' => 86400]);

$tabwebname = "IES Arroyo Hondo";
$basewebsiteurl = 'https://www.mediclalappointment.com';

$url = $_SERVER['REQUEST_URI'];

function loadPage($destino){
	print "<meta http-equiv=Refresh content='0 ; url=$destino'>";
}
function getEnviroment() {
	$urli = $_SERVER['SERVER_NAME'];
	$regexLogin = "/127.0.0.1/";
	$matchDev = strpos('127.0.0.1', $urli);
	if ($matchDev > -1 ) {
		error_reporting(2);
		return 'development';
	} else {
		error_reporting(0);
		return 'production';
	}
}
function loadFrontApp($seoTemplate="test"){
  $indexTemplate = file_get_contents("./initapp.html");
  $indexTemplate = str_replace(['</SEO>'], $seoTemplate, $indexTemplate);
  echo $indexTemplate;
}
function CallAPI($method, $url, $data = false){
    $curl = curl_init();
    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    /* Optional Authentication:
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($curl, CURLOPT_USERPWD, "username:password"); */

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}
function isAdminLogged(){
  if (isset($_SESSION['logged'])) {
    return $_SESSION['logged'];
  }
  return false;
}
function createSeoTags($data, $tabwebname, $basewebsiteurl, $pathName){
  $seotitle = $data['seotitle'];
  $seodescription = $data['seodescription'];
  $seokeywords = $data['seokeywords'];
  $res = '
  <title>'.$seotitle.'</title>
  <meta property="og:title" content="'.$seotitle.' - '.$tabwebname.'" />
  <meta name="description" content="'.$seodescription.'" />
  <meta property="og:description" content="'.$seodescription.'" />
  <meta name="keywords" content="'.$seokeywords.'" />
  <link rel="canonical" href="'.$basewebsiteurl.''.$pathName.'" />
  <meta property="og:url" content="'.$basewebsiteurl.''.$pathName.'" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="//www.mediclalappointment.com/assets/FB.jpg" />
  <meta property="og:image:width" content="300" />
  <meta property="og:image:height" content="300" />
  <meta name="author" content="'.$tabwebname.'" />
  <meta name="owner" content="'.$tabwebname.'" />
  <meta property="og:site_name" content="'.$tabwebname.'" />
  <meta property="fb:app_id" content="589826701130819" />
  ';
  return $res;
}

$environment = getEnviroment();
if(getEnviroment() != 'development') {
  $result = $_SERVER['HTTP_HOST'];
  
  if (!strstr($result, 'www')) {
    loadPage('https://www.mediclalappointment.com');
  }
  $domainEs = strstr($result, '.es');
  if (strlen($domainEs) > 0) {
    loadPage('https://www.mediclalappointment.com');
  }
}


// dentro del panel
$regexPanel = "/\/admin\/panel\/[a-zA-Z]*/";
$matchPanel = preg_match($regexPanel, $url, $match);
// echo 'estaEnRecuperaClave: '.$estaEnRecuperaClave.'<br />'.$matchPanel;
if($matchPanel && !isAdminLogged()){
  loadPage('/403');
}
// solo /admin
$regexLogin = "/\/admin$/";
$matchLogin = preg_match($regexLogin, $url, $match);
// echo 'estaEnRecuperaClave: '.$estaEnRecuperaClave.'<br />'.$matchPanel;
if($matchLogin && isAdminLogged()) {
  loadPage('/admin/panel/inicio');
  exit;
}

/* magia del seo */
$string = file_get_contents("./urlLibrary.json");
$urlLibrary = json_decode($string, true);
$current = $urlLibrary[0]['seoReqData'];
$currentPathName= $urlLibrary[0]['pathName'];
$found = false;
for($i = 1; ($i < count($urlLibrary) && (!$found)); $i ++) {
  $currentOption = $urlLibrary[$i];
  $regex = "";
  if (isset($currentOption['pathName'])) {
    $regex = $currentOption['pathName'];
  }
  if($regex) {
    $regex = preg_quote($regex, '/');
    // echo 'j-regex: '.$regex.'<br />';
    $matchPanel = preg_match('/'.$regex.'/', $url);

    if ($matchPanel) {
      // echo 'hay match';
      $currentPathName = $currentOption['pathName'];
      $current = $currentOption['seoReqData'];
      $found = true;
    }
  }
}

$response = CallAPI('POST', 'https://www.mediclalappointment.com/api/seo/getSeo.php', json_encode($current));
$response = json_decode($response, true);
$seotags = "";
if ($response) {
  $seotags = createSeoTags($response['data'],$tabwebname, $basewebsiteurl, $currentPathName);
  // echo $seotags;
}

// echo $seotags;

// echo $response;

loadFrontApp($seotags);
?>