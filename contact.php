<?php
/**
 * Contact Form Handler for Desarrolladora GAT
 * Secure PHP mail handler compatible with Bluehost/Apache
 * 
 * Security Features:
 * - Input sanitization (XSS prevention)
 * - Header injection protection
 * - Honeypot spam protection
 * - Direct access prevention
 * - Validation and error handling
 */

// Prevent direct access (only allow POST requests)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Direct access not allowed']);
    exit;
}

// Configuration
$to_email = 'contacto@gatcr.com'; // Recipient email
$site_name = 'Desarrolladora GAT';
$recaptcha_secret_key = 'YOUR_RECAPTCHA_SECRET_KEY'; // Replace with your reCAPTCHA secret key

// Initialize response
$response = ['success' => false, 'message' => ''];

try {
    // Get and sanitize form data
    $name = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';
    $honeypot = isset($_POST['website']) ? trim($_POST['website']) : ''; // Honeypot field
    $recaptcha_response = isset($_POST['g-recaptcha-response']) ? trim($_POST['g-recaptcha-response']) : '';
    
    // Honeypot spam protection (if field is filled, it's a bot)
    if (!empty($honeypot)) {
        // Silently fail - don't reveal this is a honeypot
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
        exit;
    }
    
    // Verify reCAPTCHA
    if (!empty($recaptcha_secret_key) && $recaptcha_secret_key !== 'YOUR_RECAPTCHA_SECRET_KEY') {
        if (empty($recaptcha_response)) {
            throw new Exception('Please complete the CAPTCHA verification');
        }
        
        // Verify reCAPTCHA with Google
        $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
        $recaptcha_data = [
            'secret' => $recaptcha_secret_key,
            'response' => $recaptcha_response,
            'remoteip' => $_SERVER['REMOTE_ADDR']
        ];
        
        $recaptcha_options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($recaptcha_data)
            ]
        ];
        
        $recaptcha_context = stream_context_create($recaptcha_options);
        $recaptcha_result = @file_get_contents($recaptcha_url, false, $recaptcha_context);
        
        if ($recaptcha_result === false) {
            throw new Exception('CAPTCHA verification failed. Please try again.');
        }
        
        $recaptcha_json = json_decode($recaptcha_result, true);
        
        if (!isset($recaptcha_json['success']) || !$recaptcha_json['success']) {
            throw new Exception('CAPTCHA verification failed. Please try again.');
        }
    }
    
    // Validate required fields
    if (empty($name)) {
        throw new Exception('Name is required');
    }
    
    if (empty($email)) {
        throw new Exception('Email is required');
    }
    
    if (empty($message)) {
        throw new Exception('Message is required');
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    // Sanitize inputs to prevent XSS
    $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    
    // Additional validation: length limits
    if (strlen($name) > 100) {
        throw new Exception('Name is too long');
    }
    
    if (strlen($message) > 2000) {
        throw new Exception('Message is too long');
    }
    
    // Prevent email header injection
    // Remove any newline characters that could be used for header injection
    $name = str_replace(["\r", "\n"], '', $name);
    $email = str_replace(["\r", "\n"], '', $email);
    
    // Prepare email content
    $subject = "Nuevo mensaje de contacto - " . $site_name;
    $timestamp = date('Y-m-d H:i:s');
    
    // Email body (plain text for better compatibility)
    $email_body = "Nuevo mensaje de contacto recibido\n\n";
    $email_body .= "Nombre: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Fecha: " . $timestamp . "\n\n";
    $email_body .= "Mensaje:\n";
    $email_body .= str_replace("<br>", "\n", $message) . "\n";
    
    // Prepare email headers (secure)
    $headers = [];
    $headers[] = "From: " . $site_name . " <noreply@" . $_SERVER['HTTP_HOST'] . ">";
    $headers[] = "Reply-To: " . $name . " <" . $email . ">";
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    
    // Convert headers array to string
    $headers_string = implode("\r\n", $headers);
    
    // Send email using PHP mail() function
    $mail_sent = @mail($to_email, $subject, $email_body, $headers_string);
    
    if (!$mail_sent) {
        throw new Exception('Failed to send email. Please try again later.');
    }
    
    // Success response
    $response = [
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully.'
    ];
    
} catch (Exception $e) {
    // Error response (don't expose internal errors to user)
    $response = [
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again later.'
    ];
    
    // Log error for debugging (optional - remove in production if not needed)
    // error_log('Contact form error: ' . $e->getMessage());
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
exit;
?>

