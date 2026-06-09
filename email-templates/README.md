# Plantillas de correo de CleanValle

## Recuperacion de contrasena

`password-recovery.html` puede pegarse directamente en la plantilla **Reset password** de Supabase Auth.

Utiliza la variable oficial:

- `{{ .ConfirmationURL }}`: enlace seguro generado por Supabase para recuperar la cuenta.

## Contrasena temporal

`temporary-password.html` utiliza marcadores propios:

- `{{USER_NAME}}`
- `{{USER_EMAIL}}`
- `{{TEMPORARY_PASSWORD}}`
- `{{APP_LOGIN_URL}}`

Supabase Auth no proporciona la contrasena en las variables de sus plantillas. Este correo debe enviarse desde una funcion del backend o Edge Function que reemplace los marcadores antes del envio.

La contrasena debe ser temporal, enviarse solamente al crear la cuenta y obligar al usuario a cambiarla durante su primer acceso. Nunca debe consultarse ni recuperarse posteriormente desde la base de datos.
