package util

import (
	"fmt"
	"log"
	"strconv"

	"github.com/wneessen/go-mail"
)

type SMTPConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string
}

type EmailPayload struct {
	To      string
	Subject string
	Body    string
}

type AsyncSender struct {
	cfg SMTPConfig
}

func NewAsyncSender(cfg SMTPConfig) *AsyncSender {
	return &AsyncSender{cfg: cfg}
}

func (a *AsyncSender) Send(payload EmailPayload) {
	go func() {
		if err := send(a.cfg, payload); err != nil {
			log.Printf("email send failed: %v", err)
		}
	}()
}

func send(cfg SMTPConfig, payload EmailPayload) error {
	port, err := strconv.Atoi(cfg.Port)
	if err != nil {
		return fmt.Errorf("invalid SMTP port %q: %w", cfg.Port, err)
	}

	m := mail.NewMsg()
	if err := m.From(cfg.From); err != nil {
		return fmt.Errorf("set from: %w", err)
	}
	if err := m.To(payload.To); err != nil {
		return fmt.Errorf("set to: %w", err)
	}
	m.Subject(payload.Subject)
	m.SetBodyString(mail.TypeTextHTML, payload.Body)

	c, err := mail.NewClient(cfg.Host,
		mail.WithPort(port),
		mail.WithUsername(cfg.Username),
		mail.WithPassword(cfg.Password),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
	)
	if err != nil {
		return fmt.Errorf("mail client: %w", err)
	}

	if err := c.DialAndSend(m); err != nil {
		return fmt.Errorf("smtp send: %w", err)
	}

	log.Printf("email sent to %s: %s", payload.To, payload.Subject)
	return nil
}
