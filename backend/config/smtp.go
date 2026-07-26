package config

// SMTPConfig holds SMTP server credentials and notification email settings.
type SMTPConfig struct {
	Host              string
	Port              string
	Username          string
	Password          string
	FromEmail         string
	NotificationEmail string
}

// LoadSMTP reads SMTP configuration from the environment.
func LoadSMTP() (*SMTPConfig, error) {
	host, err := MustEnv("SMTP_HOST")
	if err != nil {
		return nil, err
	}
	username, err := MustEnv("SMTP_USERNAME")
	if err != nil {
		return nil, err
	}
	password, err := MustEnv("SMTP_PASSWORD")
	if err != nil {
		return nil, err
	}
	fromEmail, err := MustEnv("FROM_EMAIL")
	if err != nil {
		return nil, err
	}
	notificationEmail, err := MustEnv("NOTIFICATION_EMAIL")
	if err != nil {
		return nil, err
	}
	return &SMTPConfig{
		Host:              host,
		Port:              GetEnv("SMTP_PORT", "587"),
		Username:          username,
		Password:          password,
		FromEmail:         fromEmail,
		NotificationEmail: notificationEmail,
	}, nil
}
