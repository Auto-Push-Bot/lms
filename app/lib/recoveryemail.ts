import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function sendRecoveryEmail(email: string, token: string) {
    try {
        const msg = {
            to: email,
            from: 'lmsemailverificacion@gmail.com',
            subject: 'Recuperar Contraseña - LMS',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verificación de Email</title>
                    <style>
                        /* General Reset */
                        body, html {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                            font-family: Arial, sans-serif;
                            background-color: #f7fafc; /* bg-gray-100 */
                        }
                        /* Main Container */
                        .main-container {
                            width: 100%;
                            max-width: 600px;
                            margin: auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        /* Header and Footer */
                        .header, .footer {
                            color: white;
                            background: linear-gradient(to bottom, #000000, #6c6c6c);
                            text-align: center; /* Cambio para centrar el texto */
                        }
                        .header {
                            padding: 2rem 0;
                        }
                        .footer {
                            padding: 1rem 0;
                            font-size: 0.875rem;
                        }
                        /* Divider Lines */
                        .divider-top, .divider-bottom {
                            height: 0.5rem;
                            background: linear-gradient(to bottom, #f97316, #fbbf24);
                        }
                        /* Content Box */
                        .content-container {
                            padding: 2rem;
                            text-align: center;
                        }
                        .welcome-text {
                            font-size: 1.25rem;
                            color: #4a5568;
                            font-weight: 500;
                            margin-bottom: 1rem;
                        }
                        .highlight-text {
                            color: #f97316;
                        }
                        .verify-link {
                            margin-top: 1.5rem;
                        }
                        .verify-link a {
                            color: #1d4ed8;
                            text-decoration: none;
                            font-size: 1rem;
                        }
                        .verify-link a:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <div class="main-container">
                        <!-- Header -->
                        <div class="header">
                            <h1>LMS</h1>
                        </div>
                        
                        <!-- Top Divider -->
                        <div class="divider-top"></div>
                        
                        <!-- Main Content -->
                        <div class="content-container">
                            <p class="welcome-text">
                                <strong class="highlight-text">¿Olvidaste tu contraseña?</strong>
                                <br>Haz click a continuación para cambiar tu contraseña.
                            </p>
                            <div class="verify-link">
                                <a href="${process.env.AUTH_URL}/recovery/${token}">
                                    Recuperar contraseña
                                </a>
                            </div>
                        </div>
                        
                        <!-- Bottom Divider -->
                        <div class="divider-bottom"></div>
                        
                        <!-- Footer -->
                        <div class="footer">
                            <p>Proyecto PPS - Giménez - 2024</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await sgMail.send(msg);

        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { error: true };
    }
}