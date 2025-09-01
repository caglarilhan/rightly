<?php
/**
 * Plugin Name: GDPR Hub Lite
 * Plugin URI: https://gdprhublite.com
 * Description: GDPR DSAR otomasyonu için WooCommerce entegrasyonu
 * Version: 1.0.0
 * Author: GDPR Hub Lite Team
 * License: GPL v2 or later
 * Text Domain: gdpr-hub-lite
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.4
 * WC requires at least: 5.0
 * WC tested up to: 8.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('GDPR_HUB_LITE_VERSION', '1.0.0');
define('GDPR_HUB_LITE_PLUGIN_URL', plugin_dir_url(__FILE__));
define('GDPR_HUB_LITE_PLUGIN_PATH', plugin_dir_path(__FILE__));

/**
 * Main GDPR Hub Lite Plugin Class
 */
class GDPRHubLite {
    
    private $api_url;
    private $api_key;
    
    public function __construct() {
        $this->api_url = get_option('gdpr_hub_lite_api_url', 'http://localhost:8001');
        $this->api_key = get_option('gdpr_hub_lite_api_key', '');
        
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('wp_ajax_gdpr_create_request', array($this, 'create_dsar_request'));
        add_action('wp_ajax_nopriv_gdpr_create_request', array($this, 'create_dsar_request'));
        add_shortcode('gdpr_hub_portal', array($this, 'render_dsar_portal'));
        
        // GDPR compliance hooks
        add_action('wp_ajax_export_personal_data', array($this, 'export_personal_data'));
        add_action('wp_ajax_erase_personal_data', array($this, 'erase_personal_data'));
    }
    
    public function init() {
        load_plugin_textdomain('gdpr-hub-lite', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'GDPR Hub Lite',
            'GDPR Hub Lite',
            'manage_options',
            'gdpr-hub-lite',
            array($this, 'admin_page'),
            'dashicons-shield',
            30
        );
        
        add_submenu_page(
            'gdpr-hub-lite',
            'Settings',
            'Settings',
            'manage_options',
            'gdpr-hub-lite-settings',
            array($this, 'settings_page')
        );
    }
    
    /**
     * Admin page
     */
    public function admin_page() {
        $requests = $this->get_dsar_requests();
        ?>
        <div class="wrap">
            <h1>🛡️ GDPR Hub Lite</h1>
            
            <div class="card">
                <h2>DSAR Requests</h2>
                <p>Total requests: <?php echo count($requests); ?></p>
                
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($requests as $request): ?>
                        <tr>
                            <td><?php echo esc_html($request['subject_email']); ?></td>
                            <td><?php echo esc_html($request['request_type']); ?></td>
                            <td>
                                <span class="status-<?php echo esc_attr($request['status']); ?>">
                                    <?php echo esc_html($request['status']); ?>
                                </span>
                            </td>
                            <td><?php echo esc_html($request['created_at']); ?></td>
                            <td><?php echo esc_html($request['due_date']); ?></td>
                            <td>
                                <a href="#" class="button" onclick="viewRequest(<?php echo $request['id']; ?>)">
                                    View
                                </a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            
            <div class="card">
                <h2>Quick Actions</h2>
                <p>
                    <a href="<?php echo home_url('/gdpr-portal'); ?>" class="button button-primary" target="_blank">
                        View DSAR Portal
                    </a>
                    <a href="<?php echo admin_url('admin.php?page=gdpr-hub-lite-settings'); ?>" class="button">
                        Settings
                    </a>
                </p>
            </div>
        </div>
        
        <style>
        .status-new { color: #007cba; font-weight: bold; }
        .status-completed { color: #28a745; font-weight: bold; }
        .status-expired { color: #dc3545; font-weight: bold; }
        </style>
        
        <script>
        function viewRequest(id) {
            window.open('<?php echo $this->api_url; ?>/api/v1/requests/' + id, '_blank');
        }
        </script>
        <?php
    }
    
    /**
     * Settings page
     */
    public function settings_page() {
        if (isset($_POST['submit'])) {
            update_option('gdpr_hub_lite_api_url', sanitize_text_field($_POST['api_url']));
            update_option('gdpr_hub_lite_api_key', sanitize_text_field($_POST['api_key']));
            $this->api_url = get_option('gdpr_hub_lite_api_url');
            $this->api_key = get_option('gdpr_hub_lite_api_key');
        }
        ?>
        <div class="wrap">
            <h1>GDPR Hub Lite Settings</h1>
            
            <form method="post">
                <table class="form-table">
                    <tr>
                        <th scope="row">API URL</th>
                        <td>
                            <input type="url" name="api_url" value="<?php echo esc_attr($this->api_url); ?>" class="regular-text" />
                            <p class="description">GDPR Hub Lite backend API URL</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">API Key</th>
                        <td>
                            <input type="text" name="api_key" value="<?php echo esc_attr($this->api_key); ?>" class="regular-text" />
                            <p class="description">API authentication key</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
            
            <div class="card">
                <h2>Shortcode Usage</h2>
                <p>Add this shortcode to any page to display the DSAR portal:</p>
                <code>[gdpr_hub_portal]</code>
            </div>
        </div>
        <?php
    }
    
    /**
     * Create DSAR request
     */
    public function create_dsar_request() {
        check_ajax_referer('gdpr_nonce', 'nonce');
        
        $email = sanitize_email($_POST['email']);
        $type = sanitize_text_field($_POST['type']);
        $description = sanitize_textarea_field($_POST['description']);
        
        if (!is_email($email)) {
            wp_die('Invalid email address');
        }
        
        $request_data = array(
            'account_email' => get_option('admin_email'),
            'request_type' => $type,
            'subject_email' => $email,
            'description' => $description,
            'additional_info' => array(
                'source' => 'woocommerce',
                'site_url' => get_site_url(),
                'user_id' => get_current_user_id()
            )
        );
        
        $response = wp_remote_post($this->api_url . '/api/v1/requests/', array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->api_key
            ),
            'body' => json_encode($request_data)
        ));
        
        if (is_wp_error($response)) {
            wp_die('Error creating request: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        wp_send_json_success($data);
    }
    
    /**
     * Get DSAR requests
     */
    private function get_dsar_requests() {
        $response = wp_remote_get($this->api_url . '/api/v1/requests/?account_email=' . urlencode(get_option('admin_email')), array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key
            )
        ));
        
        if (is_wp_error($response)) {
            return array();
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        return is_array($data) ? $data : array();
    }
    
    /**
     * Render DSAR portal
     */
    public function render_dsar_portal() {
        ob_start();
        ?>
        <div class="gdpr-hub-portal">
            <h2>🛡️ GDPR Data Request Portal</h2>
            <p>Request access to your personal data or request deletion.</p>
            
            <form id="gdpr-request-form">
                <?php wp_nonce_field('gdpr_nonce', 'gdpr_nonce'); ?>
                
                <div class="form-row">
                    <label for="email">Email Address:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                
                <div class="form-row">
                    <label for="type">Request Type:</label>
                    <select id="type" name="type" required>
                        <option value="access">Access my data</option>
                        <option value="portability">Export my data</option>
                        <option value="erasure">Delete my data</option>
                        <option value="rectification">Correct my data</option>
                    </select>
                </div>
                
                <div class="form-row">
                    <label for="description">Additional Information:</label>
                    <textarea id="description" name="description" rows="4"></textarea>
                </div>
                
                <button type="submit" class="button button-primary">Submit Request</button>
            </form>
            
            <div id="gdpr-response" style="display: none;"></div>
        </div>
        
        <style>
        .gdpr-hub-portal {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        .form-row {
            margin-bottom: 15px;
        }
        .form-row label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-row input,
        .form-row select,
        .form-row textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        </style>
        
        <script>
        jQuery(document).ready(function($) {
            $('#gdpr-request-form').on('submit', function(e) {
                e.preventDefault();
                
                var formData = {
                    action: 'gdpr_create_request',
                    nonce: $('#gdpr_nonce').val(),
                    email: $('#email').val(),
                    type: $('#type').val(),
                    description: $('#description').val()
                };
                
                $.post(ajaxurl, formData, function(response) {
                    if (response.success) {
                        $('#gdpr-response').html(
                            '<div class="notice notice-success"><p>✅ Request submitted successfully! You will receive a response within 30 days.</p></div>'
                        ).show();
                        $('#gdpr-request-form')[0].reset();
                    } else {
                        $('#gdpr-response').html(
                            '<div class="notice notice-error"><p>❌ Error submitting request. Please try again.</p></div>'
                        ).show();
                    }
                });
            });
        });
        </script>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Export personal data
     */
    public function export_personal_data() {
        check_ajax_referer('gdpr_nonce', 'nonce');
        
        $email = sanitize_email($_POST['email']);
        
        // Get user data
        $user = get_user_by('email', $email);
        if (!$user) {
            wp_die('User not found');
        }
        
        $data = array(
            'user_info' => array(
                'ID' => $user->ID,
                'user_login' => $user->user_login,
                'user_email' => $user->user_email,
                'display_name' => $user->display_name,
                'user_registered' => $user->user_registered
            ),
            'orders' => $this->get_user_orders($user->ID),
            'meta' => get_user_meta($user->ID)
        );
        
        wp_send_json_success($data);
    }
    
    /**
     * Erase personal data
     */
    public function erase_personal_data() {
        check_ajax_referer('gdpr_nonce', 'nonce');
        
        $email = sanitize_email($_POST['email']);
        
        // Get user data
        $user = get_user_by('email', $email);
        if (!$user) {
            wp_die('User not found');
        }
        
        // Anonymize user data
        wp_update_user(array(
            'ID' => $user->ID,
            'user_email' => 'deleted_' . $user->ID . '@deleted.com',
            'display_name' => 'Deleted User',
            'first_name' => '',
            'last_name' => ''
        ));
        
        // Delete user meta
        delete_user_meta($user->ID, 'first_name');
        delete_user_meta($user->ID, 'last_name');
        delete_user_meta($user->ID, 'billing_first_name');
        delete_user_meta($user->ID, 'billing_last_name');
        delete_user_meta($user->ID, 'billing_email');
        delete_user_meta($user->ID, 'billing_phone');
        delete_user_meta($user->ID, 'billing_address_1');
        delete_user_meta($user->ID, 'billing_address_2');
        delete_user_meta($user->ID, 'billing_city');
        delete_user_meta($user->ID, 'billing_postcode');
        delete_user_meta($user->ID, 'billing_country');
        
        wp_send_json_success('Data erased successfully');
    }
    
    /**
     * Get user orders
     */
    private function get_user_orders($user_id) {
        $orders = wc_get_orders(array(
            'customer_id' => $user_id,
            'limit' => -1
        ));
        
        $order_data = array();
        foreach ($orders as $order) {
            $order_data[] = array(
                'id' => $order->get_id(),
                'status' => $order->get_status(),
                'total' => $order->get_total(),
                'date_created' => $order->get_date_created()->format('Y-m-d H:i:s'),
                'billing' => $order->get_address('billing'),
                'shipping' => $order->get_address('shipping')
            );
        }
        
        return $order_data;
    }
}

// Initialize plugin
new GDPRHubLite();

// Activation hook
register_activation_hook(__FILE__, function() {
    add_option('gdpr_hub_lite_api_url', 'http://localhost:8001');
    add_option('gdpr_hub_lite_api_key', '');
});

// Deactivation hook
register_deactivation_hook(__FILE__, function() {
    // Cleanup if needed
});

