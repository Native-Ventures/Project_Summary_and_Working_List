<?php

file_put_contents('mydata.txt', file_get_contents('php://input'), FILE_APPEND | LOCK_EX);

?>