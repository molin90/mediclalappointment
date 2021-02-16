<?php
session_start(['cookie_lifetime' => 86400]);
error_reporting(2);
setUpBDParams();
$_SESSION['BASE_WEBSITE_URL'] = 'www.sitiopublico.com';


function getEnviroment() {
	$url = $_SERVER['SERVER_NAME'];
	$regexLogin = "/127.0.0.1/";
	$matchDev = strpos('127.0.0.1', $url);
	if ($matchDev > -1 ) {
		error_reporting(2);
		return 'development';
	} else {
		error_reporting(0);
		return 'production';
	}
}

function setCORS(){
	// solo /admin
	if(getEnviroment() == 'development') {
		header('Access-Control-Allow-Origin: http://127.0.0.1:8089');
	} else {
		if ($_SERVER["HTTPS"]) {
			$header = 'Access-Control-Allow-Origin: https://'.$_SESSION['BASE_WEBSITE_URL'];
		} else {
			$header = 'Access-Control-Allow-Origin: http://'.$_SESSION['BASE_WEBSITE_URL'];
		}
		header($header);
	}
	header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
	header("Access-Control-Allow-Credentials: true");
	header("Allow: GET, POST, OPTIONS, PUT, DELETE");
	$method = $_SERVER['REQUEST_METHOD'];
	if($method == "OPTIONS") {
			die();
	}
}

function hasError($dataRes){
	return isset($dataRes['error']);
}

function giveResponse($dataRes, $status) {
	http_response_code($status);
	/* if(gettype($dataRes) === 'object') {
		$dataRes->status =  $status;
	} else {
		$dataRes['status'] = $status;
	} */
	echo json_encode((array)$dataRes);
}

function setSession($key, $value){
	$_SESSION[$key]=$value;
	setcookie('"'.$key.'"',$value, time() + (86400 * 30), "/");
}

function setUpBDParams() {
	if(getEnviroment() === 'development') {
		$_SESSION['HOST'] = 'localhost';
		$_SESSION['DBNAME'] = 'apprenilladb';
		$_SESSION['DBUSER'] = 'root';
		$_SESSION['DBPASS'] = '';
	} else {
		//$_SESSION['HOST'] = 'rdbms.strato.de';
		//$_SESSION['DBNAME'] = 'DB4199354';
		//$_SESSION['DBUSER'] = 'U4199354';
		//$_SESSION['DBPASS'] = ''; 
	}
}

function sqlConnect() {
	$mysqli = new mysqli($_SESSION['HOST'], $_SESSION['DBUSER'], $_SESSION['DBPASS'], $_SESSION['DBNAME']);
	return $mysqli;
}

function conectar() {
	$localhost=$_SESSION['HOST'];
	$dbname=$_SESSION['DBNAME'];
	$dbuser=$_SESSION['DBUSER'];
	$dbpass=$_SESSION['DBPASS'];
	$url = $_SERVER['SERVER_NAME'];
	// echo 'me conecto con :'.$dbname;
	$db = new PDO('mysql:host='.$localhost.';dbname='.$dbname, $dbuser, $dbpass);
	$db -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$db -> query('SET NAMES utf8');
	return $db;
}


function enviaMailF($remitente, $destino, $asunto, $contenido){
	$destino =$destino;
	$asunto = html_entity_decode($asunto);
	$encabezados = "From: ".$remitente."\nReply-To: $remitente\nContent-Type: text/html; charset=utf-8\r\n" ;
	try{
		$exito=mail($destino, $asunto, $contenido, $encabezados);
	}catch(Exception $e){
		$exito = 0;
	}
	return $exito;
}

function desconectar($conexion) {$conexion = NULL;}

/* #===========================================================#
 * #    Funciones auxiliares                                   #
 * #===========================================================#
 */

function createFolderName($outPutPath, $name) {
  $folderName=urlToUrlAmigable($name);
  $res = creaCarpeta($outPutPath, $folderName);
  return $outPutPath.'/'.$folderName;
}

function formatID($id){
  $ref = '';
  $numMax = 6;
  $leng = strlen($id);

  while(strlen($ref) < $numMax) {
    $ref=strJoin($ref,'', '0');
  }
  $ref = $ref.$id;
  return $ref;
}

function getJsonKeys ($data) {
	$jsonKeys = array();
	foreach($data as $key => $val) {
		array_push($jsonKeys, $key);
	}
	return $jsonKeys;
}

 function strContains($needle, $haystack) {
	 $res = false;
	 if (strpos($haystack, $needle) !== false) {
		 $res = true;
	 }
	 return $res;
 }

function ToObject($Array) { 
	// Create new stdClass object 
	$object = new stdClass(); 
		
	// Use loop to convert array into 
	// stdClass object 
	foreach ($Array as $key => $value) { 
			if (is_array($value)) { 
					$value = ToObject($value); 
			} 
			$object->$key = $value; 
	} 
	return $object; 
} 


function array_find($needle, array $haystack){
    foreach ($haystack as $key => $value) {
        if (false !== stripos($value, $needle)) {
            return $key;
        }
    }
    return false;
}

function ejecutaConsulta($stringconsulta, $insertId=0) {
	$conexion=conectar();
	$consulta = $conexion -> prepare($stringconsulta);
	$consulta -> execute();
	$last_id = $conexion->lastInsertId();
	desconectar($conexion);
	if ($insertId) {
		return $last_id;
	}
	return $consulta;
}

function filter_jsonArray($collection, $key, $value){
  $res = array();
  for ($c = 0; $c < count($collection); $c++) {
		$currentItem = $collection[$c];
    if ($currentItem -> $key === $value) {
      array_push($res, $currentItem);
    }
	}
  return $res;
}

function strJoin($finalStr, $delimiter, $append) {
  $res = $finalStr;
  if ($res == '') {
    $res = $append;
  } else {
    $res = $res.$delimiter.$append;
  }
  return $res;
}

function obtenerDatos2Array($nombreTabla, $stringAtributos,$stringCondiciones,$apendice, $stdClass = false){

	$atributos=explode(',',$stringAtributos);
	$condiciones=explode(',',$stringCondiciones);
	$stringConsulta="SELECT ";
	for($tokken=0; $tokken<count($atributos);$tokken++){
		if($tokken==(count($atributos)-1)){
			$stringConsulta.=$atributos[$tokken];
		}else{
			$stringConsulta.=$atributos[$tokken].',';
		}

	}
	$stringConsulta.=' FROM '.$nombreTabla;

	if($stringCondiciones!=''){
		for($tokkenc=0; $tokkenc<count($condiciones);$tokkenc++){
			if($tokkenc==0){$stringConsulta.=" WHERE ";}
				$stringConsulta.=$condiciones[$tokkenc].' ';
		}
	}
	if($apendice!=""){
		$stringConsulta.=" ".$apendice;
	}
	// echo '<p>$stringConsulta: '.$stringConsulta.'</p>';
	$consulta=ejecutaConsulta($stringConsulta);
	$res = array();
	
	$r=0;
	while($fila=$consulta->fetch()){
		$resObj;
		if($stdClass === true){
			$resObj = new StdClass;
		} 
		for($j=0;$j<count($atributos);$j++){
			//Si el atributo contiene un punto
			$atr=$atributos[$j];
			if(strpos($atr,'.')>0){
				$atrexplode=explode('.',$atr);
				$atr=$atrexplode[1];
			}
			// tratamiento si es json o array
			$datoAux=$fila[$atr];
			if($stdClass === true){
				$resObj->$atr = html_entity_decode($datoAux);
			} else {
				$res[$r][$atr]=$datoAux;
			}
		}
		if($stdClass === true){
			array_push($res, $resObj);
		}
		$r++;
	}

	return $res;
}
function modificaDatos2BD($table,$atributos,$valores){
	/*el primer atributo sera el id*/

	$atributos=explode(',',$atributos);
	$valores=explode('-*|*-',$valores);
	$res=0;
	if(count($atributos)==count($valores)){
		$consulta="UPDATE ".$table." SET ";
		for($a=1;$a<count($atributos);$a++){
			if($a==(count($atributos))-1){
				$consulta=$consulta."".$atributos[$a]."='".$valores[$a]."'";
			}else{
				$consulta=$consulta."".$atributos[$a]."='".$valores[$a]."', ";
			}
		}
		$consulta=$consulta." WHERE ".$atributos[0]."='".$valores[0]."'";
		// echo "<p>".$consulta."</p>";
		ejecutaConsulta($consulta);
		$res=1;
	}
	return $res;
}

function getColumnsNameFromTable($table) {
	$query = 'SHOW COLUMNS FROM '.$table;
	$consulta=ejecutaConsulta($query);
	$res = [];
	while($fila=$consulta->fetch()){ 
		$columnName=$fila['Field'];
		array_push($res, $columnName);
	}
	return $res;
}

function getInfoCommentsFromTable($table) {
	$query = 'SELECT COLUMN_NAME, COLUMN_COMMENT, TABLE_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME = "'.$table.'" AND COLUMN_COMMENT <>""';
	$consulta=ejecutaConsulta($query);
	$res = [];
	while($fila=$consulta->fetch()){ 
		$entityName=$fila['COLUMN_NAME'];
		$columnComment = $fila['COLUMN_COMMENT'];
		$res[$entityName] = array();
		$columnTokkens = explode(';', $columnComment);
		for ($t=0;$t < count($columnTokkens) ; $t++) {
			$item = $columnTokkens[$t];
			$itemTokkens = explode(':', $item);
			$res[$entityName][$itemTokkens[0]] = $itemTokkens[1];
		}
	}
	return $res;
}

function surroundedUpdate($entity, $strFields, $strValues, $giveResponse = 0) {
	$dataRes = array();
	$update = 0;
  try {
    $update = modificaDatos2BD($entity,$strFields,$strValues);
    if ($update > 0) {
      $dataRes['infoOp'] = '<span>Nuev@ '.$entity.' modificado con éxito</span><span id="refreshSuccess"></span>';
      $dataRes['operation'] = 'success';
    } else {
      $dataRes['infoOp'] = 'Ha ocurrido un error con los datos recibidos';
      $dataRes['operation'] = 'error';
    }
    if($giveResponse == 1) { giveResponse($dataRes, 200); }
  } catch (Exception $e) {
		echo $e;
    $dataRes['infoOp'] = 'Ha ocurrido un error pongase en contacto con su webmaster';
    $dataRes['operation'] = 'error';
    giveResponse($dataRes, 200);
	}
	return $update;
}


function eliminaDatos2BD($tabla,$atributos,$valores){
	$atributos=explode(',',$atributos);
	$valores=explode(',',$valores);
	$res=0;
	if(count($atributos)==count($valores)){
		$consulta="DELETE FROM ".$tabla." WHERE ";
		for($a=0;$a<count($atributos);$a++){
			if($a==(count($atributos))-1){
				$consulta=$consulta."".$atributos[$a]."='".$valores[$a]."'";
			}else{
				$consulta=$consulta."".$atributos[$a]."='".$valores[$a]."' AND ";
			}
		}
		// echo "consulta: ".$consulta;
		ejecutaConsulta($consulta);
		$res=1;
	}
	return $res;
}


function appendHiddenFormValues($tabla,$atributos,$valores) {
	$tableInfo = getInfoCommentsFromTable($tabla);
	$tableInfokeys = getJsonKeys($tableInfo);
	$hiddenKeys = [];
	// look for hidden values
	$strField = "";
	$strValues = "";
	for ($p = 0; $p < count($tableInfokeys); $p++) {
		$currentKey = $tableInfokeys[$p];
		$currentField = $tableInfo[$currentKey];
		if(isset($currentField["formHidden"]) && $currentField["formHidden"] != "true") {
			$info = $currentField["formHidden"];
			$strField = strJoin($strField,',',$currentKey);
			$hiddenKeys[$currentKey] = $info;
		}
	}
	
	// CALCULAMOS VALORES DE LOS HIDDENKEYS USANDO VALORES VALORES
	foreach ($hiddenKeys as $key => $val) {
		$dependencies = explode(',',$val);
		$currentStrValues = "";
		for($d=0;$d<count($dependencies);$d++){
			$currentDependency= explode('-', $dependencies[$d]);
			$start = 0;
			$strLen = strlen($currentDependency[0]);
			if($currentDependency[1]) {
				$start = $currentDependency[1];
			}
			if($currentDependency[2]) {
				$strLen = $currentDependency[2];
			}
			$index = array_search($currentDependency[0], $atributos);
			$currentStrValues =  strJoin($currentStrValues, '/', substr($valores[$index], $start, $strLen));
		}
		$strValues = strJoin($strValues, '-*|*-',$currentStrValues);
	}

	/* var_dump($strField);
	var_dump($strValues); */
	$res['strFields'] = $strField;
	$res['strValues'] = $strValues;
	return $res;
	
}

function getIdFieldFromTableInfo($table){
	$tableInfo = getColumnsNameFromTable($table);
	$resIdField = "";
	// var_dump($tableInfo);
	for ($t=0;$t<count($tableInfo);$t++) {
		$currentField = $tableInfo[$t];
    if (strpos($currentField, 'id') === 0) {
      $resIdField = $currentField;
    }
	}
	return $resIdField;
}

function getIdField($currentInstance) {
  $res = 0;
  $fieldList = getJsonKeys($currentInstance);
  for ($f=0; $f<count($fieldList); $f++) {
    $currentField = $fieldList[$f];
    if (strpos($currentField, 'id') === 0) {
      $res = $currentField;
    }
  }

  return $res;
}

function insertDatos2BD($tabla,$atributos,$valores){

	$stringAtributos=$atributos;
	$atributos=explode(',',$atributos);
	$valores=explode('-*|*-',$valores);
	$hiddenKeys = appendHiddenFormValues($tabla, $atributos, $valores);

	$res=0;
	try {
		if (count($atributos)==count($valores)) {
			$consulta="INSERT INTO ".$tabla."(";
			for ($a=0;$a<count($atributos);$a++) {
				if ($a!=(count($atributos)-1)) {
					$consulta.=$atributos[$a].',';
				} else {
					$consulta.=$atributos[$a].')';
				}
			}

			$consulta.=" VALUES (";
			for ($v=0;$v<count($valores);$v++) {
				if ($v!=(count($valores)-1)) {
					$consulta.='\''.trim($valores[$v]).'\',';
				} else {
					$consulta.='\''.trim($valores[$v]).'\')';
				}
			}
			$consulta.="; SELECT LAST_INSERT_ID();";
			// echo 'consulta:'.$consulta;
			$res=ejecutaConsulta($consulta, 1);
			
			if ($hiddenKeys['strFields'] != "") {
				// entitycurrent 
				$idField=getIdFieldFromTableInfo($tabla);
				// pending idFieldName and value
				array_unshift($atributos, $idField);
				array_unshift($valores, $res);
				// $current = obtenerDatos2Array($table, $atributos, $valores);
				// creating hiddenKeys with this new prop
				$hiddenKeys = appendHiddenFormValues($tabla, $atributos, $valores);
				// var_dump($atributos);
				if ($hiddenKeys['strFields'] != "") {
					array_push($atributos, $hiddenKeys['strFields']);
					array_push($valores, $hiddenKeys['strValues']);
					//now he must update
					$atributos = implode(',', $atributos);
					$valores = implode('-*|*-', $valores);
					modificaDatos2BD($tabla, $atributos, $valores);
				}
			}
			// aquí tengo el ultimo registro metido
		}
	} catch (Exception $err) {
		echo 'exception: '.var_dump($err);
		$res = 0;
	}
	return $res;
}

function surroundedInsert($entity, $strFields, $strValues, $giveResponse = 0) {
	$dataRes = array();
	$insert = 0;
  try {
    $insert = insertDatos2BD($entity,$strFields,$strValues);
    if ($insert > 0) {
      $dataRes['infoOp'] = '<span>Nuev@ '.$entity.' añadido con éxito</span><span id="refreshSuccess"></span>';
      $dataRes['operation'] = 'success';
    } else {
      $dataRes['infoOp'] = 'Ha ocurrido un error con los datos recibidos';
      $dataRes['operation'] = 'error';
    }
    if($giveResponse == 1) { giveResponse($dataRes, 200); }
  } catch (Exception $e) {
    $dataRes['infoOp'] = 'Ha ocurrido un error pongase en contacto con su webmaster';
    $dataRes['operation'] = 'error';
    giveResponse($dataRes, 200);
	}
	return $insert;
}

function cryptconsha1($string) {
	// Creamos un salt
	$salt = sha1($string."%*4!#$;.k~'(_@");
	$string = sha1("$salt$string$salt");
	return $string;
}

function cadenaSoloLetrasYlonguitud($string,$longuitud){
	$string=trim($string);
	$res=true;
	if (strlen($string)<3 || strlen($string)>($longuitud+25)){$res=false;}

   //compruebo que los caracteres sean los permitidos
   $permitidos = "aábcdeéfghiíjklmnñoópqrstuúÜüvwxyzçÇ AÁBCDEÉFGHIÍJKLMNÑOÓPQRSTUÚVWXYZ-";

   for ($i=0; ($i<strlen($string) & $res); $i++){
      if (strpos($permitidos, substr($string,$i,1))===false){
         //echo $nombre_usuario . " no es válido<br>";
         $res=false;
      }
   }
   return $res;
}

function dameURL(){$url="http://".$_SERVER['HTTP_HOST'].":".$_SERVER['SERVER_PORT'].$_SERVER['REQUEST_URI'];return $url;}

function obtenerFechaHora(){
	$now=getdate();
	$fechaHora="{$now['mday']}/{$now['mon']}/{$now['year']} {$now['hours']}:{$now['minutes']};{$now['seconds']}";
	return $fechaHora;
}

function id_youtube($url) {
    $patron = '%^ (?:https?://)? (?:www\.)? (?: youtu\.be/ | youtube\.com (?: /embed/ | /v/ | /watch\?v= ) ) ([\w-]{10,12}) $%x';
    $array = preg_match($patron, $url, $parte);
    if (false !== $array) {
        return $parte[1];
    }
    return false;
}

function loadPage($destino){
	print "<meta http-equiv=Refresh content='0 ; url=$destino'>";
}

function numeroAleatorio($max){
		if($max>0){
			$aleatorio=mt_rand(0, $max);
			return $aleatorio;
		}else{
			return 0;
		}
}

function pullOutWordsOfString ($contenido, $cantidadPalabras ) {
 $contenido = explode(' ', $contenido);
 $contenido = array_slice($contenido, 0, $cantidadPalabras);
 $contenido = implode(' ', $contenido);
 return $contenido;
}


function Mayus($variable) {
	$variable = strtr(strtoupper($variable),"àèìòùáéíóúçñäëïöü","ÀÈÌÒÙÁÉÍÓÚÇÑÄËÏÖÜ");
	return $variable;
}
function Minus($variable){
	$variable = strtr(strtolower($variable),"ÀÈÌÒÙÁÉÍÓÚÇÑÄËÏÖÜ","àèìòùáéíóúçñäëïöü");
	return $variable;

}

// CK TO BD
function scA($variable){
	//Esto lo puedo reemplar xk despues al mostrar no hay problemas
	$variable=str_replace("#*#","&",$variable);
	$variable=str_replace("#@#","\'",$variable);
	$variable=str_replace("#%#","ñ'",$variable);
	$variable=str_replace("#1%#","ñ'",$variable);

	/*mete las negritas, las meto diferentes para distinguirlas en el ckeditor*/
	$variable=str_replace("<strong>",'<span class="bold">',$variable);
	$variable=str_replace("</strong>",'</span>strong',$variable);
	/*cursiva idem a las negritas*/
	$variable=str_replace("<em>",'<span class="italic">',$variable);
	$variable=str_replace("</em>",'</span>em',$variable);

	/*quito los h1,h2,h3....*/
	return $variable;
}

function urlToUrlAmigable($url){
	// Tranformamos todo a minusculas
	//Remplazamos caracteres especiales latinos
	
	$find = array('á', 'é', 'í', 'ó', 'ú', 'ñ', 'Á', 'É', 'Í', 'Ó','Ú', 'Ñ');
	$repl = array('a', 'e', 'i', 'o', 'u', 'n', 'a', 'e', 'i', 'o', 'u','n',);
	$url = str_replace($find, $repl, $url);
	// Añaadimos los guiones
	$find = array(' ', '&', '\r\n', '\n', '+');
	$url = str_replace ($find, '-', $url);
	$url = strtolower($url);
	// Eliminamos y Reemplazamos demás caracteres especiales
	$find = array(/*'/[^a-z0-9\-<>]/', */'/[\-]+/', '/<[^>]*>/');
	$repl = array(/*'',*/ '-', ''); 
	$url = preg_replace ($find, $repl, $url);

return $url;
}

function validar_dni($dni){
	$res=false;
	//$res=true;
	$letra = substr($dni, -1);
	$numeros = substr($dni, 0, -1);

	if ( substr("TRWAGMYFPDXBNJZSQVHLCKE", $numeros%23, 1) == $letra && strlen($letra) == 1 && strlen ($numeros) == 8 ){
		$res=true;
	}

	if($res==false){
		/*vuelvo a aplicar todo tras sustituir letras para el NIE*/
		$dni = str_replace(array('X', 'Y', 'Z'), array(0, 1, 2), $dni);
		$letra = substr($dni, -1);
		$numeros = substr($dni, 0, -1);

		if ( substr("TRWAGMYFPDXBNJZSQVHLCKE", $numeros%23, 1) == $letra && strlen($letra) == 1 && strlen ($numeros) == 8 ){
			$res=true;
		}
	}
	return $res;
}

function validar_passport($passport){
	$res=true;
	$letras = substr($passport,0,3);
	$numeros = substr($passport,4,6);

	if(strlen($passport)!=9){$res=false;}
	//compruebo loas letras
   $permitidosLetras= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
   for ($i=0; $i<strlen($letras); $i++){
      if (strpos($permitidosLetras, substr($letras,$i,1))===false){
         $res=$res*false;
      }
   }
	//compruebo loas numeros
   $permitidosNumeros= "0123456789";
   for ($i=0; $i<strlen($numeros); $i++){
      if (strpos($permitidosNumeros, substr($numeros,$i,1))===false){
         $res=$res*false;
      }
   }
	if(strlen($passport)!=9){$res=$res*false;}

	return $res;
}

function validar_telefono($telefono){
$validacion_telefono = "/^((\+?34([ \t|\-])?)?[9|6|7]((\d{1}([ \t|\-])?[0-9]{3})|(\d{2}([ \t|\-])?[0-9]{2}))([ \t|\-])?[0-9]{2}([ \t|\-])?[0-9]{2})$/";
return preg_match($validacion_telefono, $telefono);
}

function validaCP ($cadena){
          //Comrpobamos que realmente se ha añadido el formato correcto
         if(preg_match('/^[0-9]{5}$/i', $cadena))
             //La instruccion se cumple
             return true;
          else
             //Contiene caracteres no validos
             return false;
}

function valida_email($email){
	return filter_var($email, FILTER_VALIDATE_EMAIL);
}


function callAPI($method, $url, $data = false){
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

//echo '<p>'.calculaEdad('0001-01-01','Domingo' ).'</p>';
