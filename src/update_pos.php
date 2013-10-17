<?php
define('IN_PHPBB', true);
$phpbb_root_path = (defined('PHPBB_ROOT_PATH')) ? PHPBB_ROOT_PATH : './';
$phpEx = substr(strrchr(__FILE__, '.'), 1);
require($phpbb_root_path . 'common.' . $phpEx);

// Start session management
$user->session_begin();
$auth->acl($user->data);
$user->setup('ucp');

// User must be logged to see this page
if ($user->data['user_id'] == ANONYMOUS)
{
    login_box('', $user->lang['LOGIN']);
}
$content = file_get_contents('http://www.carte-des-membres.com/loadcalque.php?idc=4222&output=csv');

$lines = explode("\n",$content);
$i = 0;
foreach($lines as $line){
	$data = explode(",",$line);
	$userid = $data[0];
	$lat = $data[1];
	$long = $data[2];
  if ($userid != ANONYMOUS && $long != '' && $lat != '') {
	 $sql = "update ". PROFILE_FIELDS_DATA_TABLE . " set pf_longitude = '".$long."', pf_latitude ='".$lat."' where user_id=".$userid;        
	 $result = $db->sql_query($sql);
	 $db->sql_freeresult($result);
	 $i++;
  }
}
echo "Nb de profils mis à jour : ".$i;

?>
