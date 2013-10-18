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

// Get additional profile fields 
$user->get_profile_fields($user->data['user_id']);

// Selection des donnees de localisation de l'ensemble des users
// qui ont accepte d'etre geolocalise (pf_geoloc = 1)
$sql = 'SELECT u.*, pf_latitude, pf_longitude
	FROM ' . PROFILE_FIELDS_DATA_TABLE . ' upd LEFT JOIN ' . USERS_TABLE . ' u ON (u.user_id = upd.user_id) 
	WHERE pf_geoloc = 1
  ORDER BY lower(u.username)';
$result = $db->sql_query($sql);
$users = array();
while ( $users[] = $db->sql_fetchrow($result) ){
}
$db->sql_freeresult($result);
// renvoie de la liste sous forme JSON à l'appelant
$return = json_encode($users);
echo $return;
?>
