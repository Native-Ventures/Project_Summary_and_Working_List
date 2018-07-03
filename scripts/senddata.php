<?php
	$data = JSON.stringify(vm.model);
    $ret = file_put_contents('tmp/mydata.txt', $data, FILE_APPEND | LOCK_EX);
    if($ret === false) {
        die('There was an error writing this file');
    }
?>