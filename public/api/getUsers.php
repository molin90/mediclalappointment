<?php 
include('./gestionBD.php');
setCORS();
$request_body = file_get_contents('php://input');
$data = json_decode($request_body);
$dataRes = array();

$dataRes['res'] = $res;
$dataRes['info'] = '';


giveResponse($dataRes, 200);

?>