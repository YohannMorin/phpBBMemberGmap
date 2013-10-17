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
$userid		= request_var('userid', ANONYMOUS);
$long		= request_var('long', '');
$lat	= request_var('lat', '');

if ($userid != ANONYMOUS && $long != '' && lat != '') {
	$sql = "update ". PROFILE_FIELDS_DATA_TABLE . " set pf_longitude = '".$long."', pf_latitude ='".$lat."' where user_id=".$userid;        
	$result = $db->sql_query($sql);
	$db->sql_freeresult($result);
}

?>
