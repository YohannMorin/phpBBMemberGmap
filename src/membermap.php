<?php
define('IN_PHPBB', true);
$phpbb_root_path = (defined('PHPBB_ROOT_PATH')) ? PHPBB_ROOT_PATH : './';
$phpEx = substr(strrchr(__FILE__, '.'), 1);
require($phpbb_root_path . 'common.' . $phpEx);
require($phpbb_root_path . 'includes/functions_user.' . $phpEx);
require($phpbb_root_path . 'includes/functions_module.' . $phpEx);
include($phpbb_root_path . 'includes/functions_display.' . $phpEx);

// Start session management
$user->session_begin();
$auth->acl($user->data);
$user->setup('ucp');

// User must be logged to see this page
if ($user->data['user_id'] == ANONYMOUS)
{
    login_box('', $user->lang['LOGIN']);
}

// Recuperation de l'id de l'utilisateur a localiser
$locatedUser = request_var('locate','');

// Passage des ids au template
$template->assign_var("USER_ID",$user->data['user_id']);
$template->assign_var("LOCATE_USER",$locatedUser);

$template->set_filenames(array(
    'body' => 'membermap_body.html',
));

page_header('Carte des membres');

page_footer();

?>
